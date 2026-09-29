import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AdminError } from '@/lib/admin/errors';

// Server actions are public endpoints: anyone can call one without the page.
// Everything past the session check throws unless a test says otherwise, so a
// test fails if an action does any work before checking.
const { getAdmin, github, untouchable } = vi.hoisted(() => {
  const untouchable = () => {
    throw new Error('reached past the session check');
  };

  // Loosely typed, so a test can make any of them resolve.
  const stub = () => vi.fn<(...args: unknown[]) => unknown>(untouchable);

  return {
    getAdmin: vi.fn(),
    untouchable,
    github: {
      getGitHubToken: stub(),
      createOctokit: stub(),
      saveDraft: stub(),
      publishDraft: stub(),
      discardDraft: stub(),
      compileMdx: stub(),
    },
  };
});

vi.mock('@/lib/admin/session', () => ({ getAdmin }));
vi.mock('@/lib/admin/github-token', () => ({
  getGitHubToken: github.getGitHubToken,
}));
vi.mock('@/lib/admin/repository', () => ({
  createOctokit: github.createOctokit,
  saveDraft: github.saveDraft,
  publishDraft: github.publishDraft,
  discardDraft: github.discardDraft,
}));
vi.mock('@/lib/admin/imagekit', () => ({ createImageUploadAuth: untouchable }));
vi.mock('@/components/admin/content-preview', () => ({
  renderContentPreview: untouchable,
}));
vi.mock('@/components/mdx/mdx-components', () => ({
  compileMdx: github.compileMdx,
}));

const actions = await import('@/actions/admin-actions');

beforeEach(() => {
  getAdmin.mockReset();
});

const input = {
  collection: 'posts' as const,
  slug: 'demo',
  values: { slug: 'demo', title: 'Demo', body: '' },
  baseSha: null,
};

describe('admin actions, signed out', () => {
  it.each([
    ['saveContentAction', () => actions.saveContentAction(input)],
    ['publishContentAction', () => actions.publishContentAction(input)],
    ['discardDraftAction', () => actions.discardDraftAction(input)],
    ['previewContentAction', () => actions.previewContentAction(input)],
    [
      'createImageUploadAuthAction',
      () => actions.createImageUploadAuthAction(),
    ],
  ])('%s refuses without doing anything', async (_, call) => {
    getAdmin.mockResolvedValue(null);

    await expect(call()).resolves.toEqual({
      ok: false,
      error: 'You are signed out. Sign in again to continue.',
      reauthorize: true,
    });
  });
});

describe('publishContentAction', () => {
  it('still reports the save when the merge after it fails', async () => {
    const draft = { number: 7, url: 'u', title: 't', headSha: 'head' };

    getAdmin.mockResolvedValue({ id: 'user-1', role: 'ADMIN' });
    github.getGitHubToken.mockResolvedValue('token');
    github.createOctokit.mockReturnValue({});
    github.compileMdx.mockResolvedValue({});
    github.saveDraft.mockResolvedValue({
      sha: 'saved-sha',
      draft,
      committed: true,
    });
    github.publishDraft.mockRejectedValue(
      new AdminError('GitHub cannot merge pull request #7', 'conflict'),
    );

    const result = await actions.publishContentAction({
      collection: 'posts',
      baseSha: null,
      values: {
        slug: 'demo',
        title: 'Demo',
        author: 'Ryan Gan',
        publishedDate: '2026-09-28',
        featured: false,
        summary: 'A demo',
        topics: [],
        body: 'Hello',
      },
    });

    // Without the new version the editor's next save would be refused.
    expect(result).toMatchObject({
      ok: false,
      error: 'GitHub cannot merge pull request #7',
      saved: { sha: 'saved-sha', draft, values: { slug: 'demo' } },
    });
  });
});
