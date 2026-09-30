import type { Octokit } from '@octokit/rest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { gitBlobSha } from '@/lib/admin/content-file';
import {
  discardDraft,
  Draft,
  getContentItem,
  publishDraft,
  saveDraft,
} from '@/lib/admin/repository';

// The live behaviour of these calls against GitHub was checked by hand; these
// pin down the decisions made on top of them.

const httpError = (status: number) =>
  Object.assign(new Error(`HTTP ${status}`), { status });

const draft: Draft = {
  number: 7,
  url: 'https://github.com/ryangandev/ryangan-portfolio/pull/7',
  title: 'Add the "Demo" post',
  headSha: 'old-head',
};

const fakeOctokit = () => ({
  graphql: vi.fn(),
  pulls: {
    merge: vi.fn(),
    get: vi.fn(),
    list: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  git: {
    getRef: vi.fn(),
    deleteRef: vi.fn(),
    createRef: vi.fn(),
    updateRef: vi.fn(),
  },
  repos: { getContent: vi.fn(), createOrUpdateFileContents: vi.fn() },
});

let octokit: ReturnType<typeof fakeOctokit>;
const asOctokit = () => octokit as unknown as Octokit;

beforeEach(() => {
  octokit = fakeOctokit();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

const publish = () =>
  publishDraft(asOctokit(), {
    collection: 'posts',
    slug: 'demo',
    draft,
    headSha: 'new-head',
  });

describe('publishDraft', () => {
  it('squash-merges exactly the saved commit, then deletes the branch', async () => {
    octokit.pulls.merge.mockResolvedValue({ data: { merged: true } });

    await publish();

    expect(octokit.pulls.merge).toHaveBeenCalledWith(
      expect.objectContaining({
        pull_number: 7,
        merge_method: 'squash',
        sha: 'new-head',
        commit_title: 'Add the "Demo" post (#7)',
      }),
    );
    expect(octokit.git.deleteRef).toHaveBeenCalledWith(
      expect.objectContaining({ ref: 'heads/content/posts/demo' }),
    );
  });

  it('waits out a pull request that still reports the commit before the save', async () => {
    // Right after a push, GitHub refuses the merge because the pull request
    // has not caught up with the branch yet.
    octokit.pulls.merge
      .mockRejectedValueOnce(httpError(409))
      .mockRejectedValueOnce(httpError(405))
      .mockResolvedValueOnce({ data: { merged: true } });
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'new-head' } },
    });
    octokit.pulls.get
      .mockResolvedValueOnce({
        data: { state: 'open', head: { sha: 'old-head' }, mergeable: null },
      })
      .mockResolvedValueOnce({
        data: { state: 'open', head: { sha: 'new-head' }, mergeable: null },
      });

    const published = publish();
    await vi.runAllTimersAsync();
    await published;

    expect(octokit.pulls.merge).toHaveBeenCalledTimes(3);
    expect(octokit.git.deleteRef).toHaveBeenCalled();
  });

  it('refuses when the branch itself has moved on since the save', async () => {
    octokit.pulls.merge.mockRejectedValue(httpError(409));
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'someone-elses-commit' } },
    });
    octokit.pulls.get.mockResolvedValue({
      data: { state: 'open', head: { sha: 'someone-elses-commit' } },
    });

    await expect(publish()).rejects.toMatchObject({
      kind: 'conflict',
      message: expect.stringMatching(/changed on GitHub/),
    });
    expect(octokit.git.deleteRef).not.toHaveBeenCalled();
  });

  it('refuses a real conflict with main without waiting for it', async () => {
    octokit.pulls.merge.mockRejectedValue(httpError(405));
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'new-head' } },
    });
    octokit.pulls.get.mockResolvedValue({
      data: { state: 'open', head: { sha: 'new-head' }, mergeable: false },
    });

    await expect(publish()).rejects.toMatchObject({
      kind: 'conflict',
      message: expect.stringMatching(/cannot merge pull request #7/),
    });
    expect(octokit.pulls.merge).toHaveBeenCalledTimes(1);
  });

  it('refuses a draft closed on GitHub', async () => {
    octokit.pulls.merge.mockRejectedValue(httpError(405));
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'new-head' } },
    });
    octokit.pulls.get.mockResolvedValue({
      data: { state: 'closed', head: { sha: 'new-head' } },
    });

    await expect(publish()).rejects.toThrow(/was closed on GitHub/);
  });

  it('gives up after a while, saying the draft is safe', async () => {
    octokit.pulls.merge.mockRejectedValue(httpError(405));
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'new-head' } },
    });
    octokit.pulls.get.mockResolvedValue({
      data: { state: 'open', head: { sha: 'old-head' }, mergeable: null },
    });

    const published = expect(publish()).rejects.toThrow(/draft is saved/);
    await vi.runAllTimersAsync();
    await published;
    expect(octokit.pulls.merge).toHaveBeenCalledTimes(6);
  });

  it('asks for a new sign-in when GitHub no longer accepts the token', async () => {
    octokit.pulls.merge.mockRejectedValue(httpError(401));

    await expect(publish()).rejects.toMatchObject({ kind: 'reauthorize' });
  });
});

describe('saveDraft', () => {
  const content = '---\ntitle: Demo\n---\n';

  it('says there is nothing to save when a published item is unchanged', async () => {
    octokit.pulls.list.mockResolvedValue({ data: [] });

    await expect(
      saveDraft(asOctokit(), {
        collection: 'posts',
        slug: 'demo',
        title: 'Demo',
        content,
        baseSha: gitBlobSha(content),
      }),
    ).rejects.toThrow(/no changes to save/);
    expect(octokit.repos.createOrUpdateFileContents).not.toHaveBeenCalled();
  });

  it('resets a branch left over from a closed pull request before writing to it', async () => {
    octokit.pulls.list.mockResolvedValue({ data: [] });
    octokit.git.getRef.mockResolvedValue({
      data: { object: { sha: 'main-tip' } },
    });
    octokit.git.createRef.mockRejectedValue(httpError(422));
    octokit.repos.createOrUpdateFileContents.mockResolvedValue({
      data: { commit: { sha: 'commit-1' } },
    });
    octokit.pulls.create.mockResolvedValue({
      data: {
        number: 8,
        html_url: 'https://github.com/pr/8',
        title: 'Add the "Demo" post',
      },
    });

    const saved = await saveDraft(asOctokit(), {
      collection: 'posts',
      slug: 'demo',
      title: 'Demo',
      content,
      baseSha: null,
    });

    expect(octokit.git.updateRef).toHaveBeenCalledWith(
      expect.objectContaining({
        ref: 'heads/content/posts/demo',
        sha: 'main-tip',
        force: true,
      }),
    );
    expect(octokit.repos.createOrUpdateFileContents).toHaveBeenCalledWith(
      expect.objectContaining({
        branch: 'content/posts/demo',
        path: 'src/content/posts/demo.mdx',
        message: 'Add the "Demo" post',
        sha: undefined,
      }),
    );
    expect(saved).toEqual({
      sha: gitBlobSha(content),
      draft: {
        number: 8,
        url: 'https://github.com/pr/8',
        title: 'Add the "Demo" post',
        headSha: 'commit-1',
      },
      committed: true,
    });
  });
});

describe('getContentItem', () => {
  it('ignores a leftover branch that has no open pull request', async () => {
    octokit.graphql.mockResolvedValue({
      repository: {
        draft: { oid: 'stale', text: 'stale draft' },
        published: { oid: 'live', text: 'published text' },
        pullRequests: { nodes: [] },
      },
    });

    await expect(getContentItem(asOctokit(), 'posts', 'demo')).resolves.toEqual(
      {
        source: 'published text',
        sha: 'live',
        draft: null,
        isPublished: true,
      },
    );
  });
});

describe('discardDraft', () => {
  it('closes the pull request unmerged and tolerates a branch already gone', async () => {
    octokit.pulls.list.mockResolvedValue({
      data: [
        {
          number: 7,
          html_url: draft.url,
          title: draft.title,
          head: { sha: 'x' },
        },
      ],
    });
    octokit.git.deleteRef.mockRejectedValue(httpError(422));

    await discardDraft(asOctokit(), 'posts', 'demo');

    expect(octokit.pulls.update).toHaveBeenCalledWith(
      expect.objectContaining({ pull_number: 7, state: 'closed' }),
    );
  });
});
