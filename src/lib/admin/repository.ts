import { Octokit } from '@octokit/rest';

import { gitBlobSha, parseContentFile } from '@/lib/admin/content-file';
import { AdminError, reauthorize, statusOf } from '@/lib/admin/errors';
import {
  Collection,
  collectionNames,
  collections,
  contentFilePath,
  isCollection,
} from '@/lib/collections';
import { contentRepository } from '@/data/site';

/*
 * The admin portal's view of the content in the GitHub repository.
 *
 * `main` is what is published: Vercel deploys it. A draft is an open pull
 * request from the branch `content/<collection>/<slug>` into `main`, holding
 * that one file. Saving commits to the branch, publishing squash-merges the
 * pull request, and discarding closes it. Each item has at most one draft,
 * because the branch name is derived from the item.
 *
 * Every call runs as the signed-in admin with their own GitHub token, so
 * GitHub itself checks their access to the repository on every write.
 */

const { owner, name: repo, branch: baseBranch } = contentRepository;

export type Draft = {
  number: number;
  url: string;
  title: string;
  /** The commit the branch points at */
  headSha: string;
};

export type ContentSummary = {
  collection: Collection;
  slug: string;
  title: string;
  /** `publishedDate` for posts, `date` for projects */
  date: string;
  featured: boolean;
};

export type PublishedSummary = ContentSummary & {
  /** Set when the file on `main` no longer validates */
  error?: string;
};

export type DraftSummary = ContentSummary & {
  draft: Draft;
  updatedAt: string;
};

export type ContentOverview = {
  published: Record<Collection, PublishedSummary[]>;
  drafts: DraftSummary[];
};

export type ContentItem = {
  source: string;
  /** Blob id of `source`, which GitHub requires to update the file */
  sha: string;
  draft: Draft | null;
  isPublished: boolean;
};

export const createOctokit = (token: string) =>
  new Octokit({ auth: token, userAgent: 'ryangan.me admin' });

export const draftBranch = (collection: Collection, slug: string) =>
  `content/${collection}/${slug}`;

const parseDraftBranch = (
  branch: string,
): { collection: Collection; slug: string } | null => {
  const [prefix, collection, slug, ...rest] = branch.split('/');

  return prefix === 'content' && isCollection(collection) && slug && !rest[0]
    ? { collection, slug }
    : null;
};

const noun = (collection: Collection) => collections[collection].noun;

/**
 * Translate the GitHub failures every call can hit into ones the portal can
 * explain. Anything else is rethrown as it is.
 */
const withGitHub = async <T>(call: () => Promise<T>): Promise<T> => {
  try {
    return await call();
  } catch (error) {
    if (error instanceof AdminError) {
      throw error;
    }

    const status = statusOf(error);

    if (status === 401) {
      throw reauthorize();
    }

    if (status === 403 || status === 404) {
      throw new AdminError(
        `GitHub refused access to ${owner}/${repo}. Check that the GitHub App ` +
          'is installed on that repository and that your account can write to it.',
        'github',
      );
    }

    throw error;
  }
};

const summarize = (
  collection: Collection,
  slug: string,
  source: string,
): ContentSummary => {
  const { frontmatter } = parseContentFile(collection, source);

  return {
    collection,
    slug,
    title: frontmatter.title,
    date:
      'publishedDate' in frontmatter
        ? frontmatter.publishedDate
        : frontmatter.date,
    featured: frontmatter.featured,
  };
};

const newestFirst = (a: ContentSummary, b: ContentSummary) =>
  b.date.localeCompare(a.date);

type TreeObject = {
  entries: { name: string; object: { text: string | null } | null }[];
} | null;

type OverviewQuery = {
  repository: Record<Collection, TreeObject> & {
    pullRequests: {
      nodes: {
        number: number;
        url: string;
        title: string;
        updatedAt: string;
        headRefName: string;
        headRefOid: string;
        isCrossRepository: boolean;
      }[];
    };
  };
};

/**
 * Everything published and every open draft, in two GraphQL requests however
 * many files there are
 */
export const getContentOverview = (
  octokit: Octokit,
): Promise<ContentOverview> =>
  withGitHub(async () => {
    const { repository } = await octokit.graphql<OverviewQuery>(
      `query ContentOverview($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          ${collectionNames
            .map(
              (
                collection,
              ) => `${collection}: object(expression: "${baseBranch}:${collections[collection].directory}") {
                ... on Tree { entries { name object { ... on Blob { text } } } }
              }`,
            )
            .join('\n')}
          pullRequests(states: OPEN, first: 100, orderBy: { field: UPDATED_AT, direction: DESC }) {
            nodes { number url title updatedAt headRefName headRefOid isCrossRepository }
          }
        }
      }`,
      { owner, repo },
    );

    const published = Object.fromEntries(
      collectionNames.map((collection) => [
        collection,
        (repository[collection]?.entries ?? [])
          .filter(({ name }) => name.endsWith('.mdx'))
          .map(({ name, object }): PublishedSummary => {
            const slug = name.replace(/\.mdx$/, '');

            try {
              return summarize(collection, slug, object?.text ?? '');
            } catch (error) {
              return {
                collection,
                slug,
                title: slug,
                date: '',
                featured: false,
                error: error instanceof Error ? error.message : String(error),
              };
            }
          })
          .sort(newestFirst),
      ]),
    ) as Record<Collection, PublishedSummary[]>;

    const pulls = repository.pullRequests.nodes.flatMap((pull) => {
      const item = pull.isCrossRepository
        ? null
        : parseDraftBranch(pull.headRefName);

      return item ? [{ ...item, pull }] : [];
    });

    if (pulls.length === 0) {
      return { published, drafts: [] };
    }

    // One aliased field per draft, since GraphQL cannot vary the file path
    // per pull request.
    const files = await octokit.graphql<{
      repository: Record<string, { text: string | null } | null>;
    }>(
      `query DraftFiles($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          ${pulls
            .map(
              ({ collection, slug, pull }, index) =>
                `d${index}: object(expression: ${JSON.stringify(
                  `${pull.headRefOid}:${contentFilePath(collection, slug)}`,
                )}) { ... on Blob { text } }`,
            )
            .join('\n')}
        }
      }`,
      { owner, repo },
    );

    const drafts = pulls.map(({ collection, slug, pull }, index) => {
      const draft: Draft = {
        number: pull.number,
        url: pull.url,
        title: pull.title,
        headSha: pull.headRefOid,
      };
      let summary: ContentSummary;

      try {
        summary = summarize(
          collection,
          slug,
          files.repository[`d${index}`]?.text ?? '',
        );
      } catch {
        // Edited by hand into something invalid; the editor shows why.
        summary = {
          collection,
          slug,
          title: pull.title,
          date: '',
          featured: false,
        };
      }

      return { ...summary, draft, updatedAt: pull.updatedAt };
    });

    return { published, drafts };
  });

type ItemQuery = {
  repository: {
    draft: { oid: string; text: string | null } | null;
    published: { oid: string; text: string | null } | null;
    pullRequests: {
      nodes: {
        number: number;
        url: string;
        title: string;
        headRefOid: string;
      }[];
    };
  };
};

/**
 * An item as the editor should open it: its open draft if there is one,
 * otherwise what is published
 * @returns null when the item has neither
 */
export const getContentItem = (
  octokit: Octokit,
  collection: Collection,
  slug: string,
): Promise<ContentItem | null> =>
  withGitHub(async () => {
    const branch = draftBranch(collection, slug);
    const path = contentFilePath(collection, slug);
    const { repository } = await octokit.graphql<ItemQuery>(
      `query ContentItem($owner: String!, $repo: String!, $draft: String!, $published: String!, $branch: String!) {
        repository(owner: $owner, name: $repo) {
          draft: object(expression: $draft) { ... on Blob { oid text } }
          published: object(expression: $published) { ... on Blob { oid text } }
          pullRequests(headRefName: $branch, baseRefName: "${baseBranch}", states: OPEN, first: 1) {
            nodes { number url title headRefOid }
          }
        }
      }`,
      {
        owner,
        repo,
        branch,
        draft: `${branch}:${path}`,
        published: `${baseBranch}:${path}`,
      },
    );
    const pull = repository.pullRequests.nodes[0];
    const draft: Draft | null = pull
      ? {
          number: pull.number,
          url: pull.url,
          title: pull.title,
          headSha: pull.headRefOid,
        }
      : null;
    const isPublished = repository.published !== null;
    // A branch without an open pull request is a leftover (merged or closed
    // outside the portal), so only an open draft counts.
    const file = (draft && repository.draft) || repository.published;

    if (!file || file.text === null) {
      return null;
    }

    return { source: file.text, sha: file.oid, draft, isPublished };
  });

const findOpenDraft = async (
  octokit: Octokit,
  branch: string,
): Promise<Draft | null> => {
  const { data } = await octokit.pulls.list({
    owner,
    repo,
    state: 'open',
    head: `${owner}:${branch}`,
    base: baseBranch,
    per_page: 1,
  });
  const pull = data[0];

  return pull
    ? {
        number: pull.number,
        url: pull.html_url,
        title: pull.title,
        headSha: pull.head.sha,
      }
    : null;
};

/**
 * Point the draft branch at the tip of `main`, creating it if needed. A
 * branch left over from a closed or merged pull request is reset: its commits
 * stay reachable from that pull request.
 */
const startDraftBranch = async (octokit: Octokit, branch: string) => {
  const { data: base } = await octokit.git.getRef({
    owner,
    repo,
    ref: `heads/${baseBranch}`,
  });

  try {
    await octokit.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: base.object.sha,
    });
  } catch (error) {
    if (statusOf(error) !== 422) {
      throw error;
    }

    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: base.object.sha,
      force: true,
    });
  }
};

const deleteBranch = async (octokit: Octokit, branch: string) => {
  try {
    await octokit.git.deleteRef({ owner, repo, ref: `heads/${branch}` });
  } catch (error) {
    // Already gone, which is the goal.
    if (statusOf(error) !== 404 && statusOf(error) !== 422) {
      throw error;
    }
  }
};

export type SaveDraftInput = {
  collection: Collection;
  slug: string;
  title: string;
  /** The formatted file */
  content: string;
  /**
   * Blob id of the file as the editor loaded it, or null for an item that did
   * not exist. GitHub refuses the write if the file has changed since, so
   * nothing saved elsewhere in the meantime is overwritten.
   */
  baseSha: string | null;
};

export type SavedDraft = {
  sha: string;
  draft: Draft;
  /** False when the content matched what was already saved */
  committed: boolean;
};

/**
 * Commit the file to the item's draft branch, opening the draft pull request
 * if there is not one yet
 */
export const saveDraft = (
  octokit: Octokit,
  { collection, slug, title, content, baseSha }: SaveDraftInput,
): Promise<SavedDraft> =>
  withGitHub(async () => {
    const branch = draftBranch(collection, slug);
    const path = contentFilePath(collection, slug);
    const sha = gitBlobSha(content);
    const draft = await findOpenDraft(octokit, branch);

    if (sha === baseSha) {
      if (!draft) {
        throw new AdminError('There are no changes to save.', 'invalid');
      }

      // Nothing to commit, but publishing merges the branch as it is now, so
      // it must still hold what the editor loaded.
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path,
        ref: draft.headSha,
      });

      if (Array.isArray(data) || data.sha !== baseSha) {
        throw new AdminError(
          `This ${noun(collection)} changed on GitHub after you opened it. ` +
            'Reload to get the latest version.',
          'conflict',
        );
      }

      return { sha, draft, committed: false };
    }

    if (!draft) {
      await startDraftBranch(octokit, branch);
    }

    let commitSha: string;

    try {
      const { data } = await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path,
        branch,
        message: draft
          ? `Revise the "${title}" ${noun(collection)}`
          : `${baseSha ? 'Update' : 'Add'} the "${title}" ${noun(collection)}`,
        content: Buffer.from(content, 'utf8').toString('base64'),
        sha: baseSha ?? undefined,
      });

      commitSha = data.commit.sha!;
    } catch (error) {
      if (statusOf(error) === 409) {
        throw new AdminError(
          `This ${noun(collection)} changed on GitHub after you opened it. ` +
            'Copy anything you want to keep, then reload to get the latest version.',
          'conflict',
        );
      }

      // Creating a file without a sha fails when the path is taken.
      if (statusOf(error) === 422 && !baseSha) {
        throw new AdminError(
          `A ${noun(collection)} with the slug "${slug}" already exists, ` +
            'published or as a draft. Choose another slug.',
          'conflict',
        );
      }

      throw error;
    }

    if (draft) {
      if (draft.title !== draftTitle(collection, title, baseSha, draft)) {
        await octokit.pulls.update({
          owner,
          repo,
          pull_number: draft.number,
          title: draftTitle(collection, title, baseSha, draft),
        });
      }

      return { sha, draft: { ...draft, headSha: commitSha }, committed: true };
    }

    const { data: pull } = await octokit.pulls.create({
      owner,
      repo,
      head: branch,
      base: baseBranch,
      title: draftTitle(collection, title, baseSha, null),
      body:
        'Drafted in the admin portal at `/admin`.\n\n' +
        `Publishing it there squash-merges this pull request, and Vercel deploys \`${baseBranch}\`.`,
    });

    return {
      sha,
      draft: {
        number: pull.number,
        url: pull.html_url,
        title: pull.title,
        headSha: commitSha,
      },
      committed: true,
    };
  });

/**
 * The pull request title: "Add" for an item `main` does not have yet, and
 * "Update" for one it does. Kept in step with the item's title as it changes.
 */
const draftTitle = (
  collection: Collection,
  title: string,
  baseSha: string | null,
  draft: Draft | null,
) => {
  const verb = draft
    ? draft.title.startsWith('Add ')
      ? 'Add'
      : 'Update'
    : baseSha
      ? 'Update'
      : 'Add';

  return `${verb} the "${title}" ${noun(collection)}`;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** About fifteen seconds of waiting, in all */
const MERGE_ATTEMPTS = 6;

/**
 * Squash-merge the draft into `main` and delete its branch
 * @param headSha the commit the editor saved last. GitHub refuses the merge if
 *        the branch has moved on since, so nothing unseen gets published.
 */
export const publishDraft = (
  octokit: Octokit,
  {
    collection,
    slug,
    draft,
    headSha,
  }: {
    collection: Collection;
    slug: string;
    draft: Draft;
    headSha: string;
  },
): Promise<void> =>
  withGitHub(async () => {
    const branch = draftBranch(collection, slug);

    for (let attempt = 1; ; attempt++) {
      try {
        await octokit.pulls.merge({
          owner,
          repo,
          pull_number: draft.number,
          merge_method: 'squash',
          sha: headSha,
          commit_title: `${draft.title} (#${draft.number})`,
        });
        break;
      } catch (error) {
        const status = statusOf(error);

        if (status !== 405 && status !== 409) {
          throw error;
        }

        // Both also come back while GitHub catches up with a commit pushed a
        // moment ago, which is exactly when the editor publishes: for a few
        // seconds the pull request still reports its previous head (409), or
        // has not worked out whether it can merge yet (405). Only a branch
        // that has really moved on, or a real conflict, is final.
        const [{ data: ref }, { data: pull }] = await Promise.all([
          octokit.git.getRef({ owner, repo, ref: `heads/${branch}` }),
          octokit.pulls.get({ owner, repo, pull_number: draft.number }),
        ]);

        if (pull.state !== 'open') {
          throw new AdminError(
            `Pull request #${draft.number} was closed on GitHub. Reload to start a new draft.`,
            'conflict',
          );
        }

        if (ref.object.sha !== headSha) {
          throw new AdminError(
            'The draft changed on GitHub after your last save. Reload to see ' +
              'the latest version before publishing.',
            'conflict',
          );
        }

        if (pull.head.sha === headSha && pull.mergeable === false) {
          throw new AdminError(
            `GitHub cannot merge pull request #${draft.number}, most likely ` +
              `because ${contentFilePath(collection, slug)} also changed on ` +
              `${baseBranch}. Resolve it on GitHub, then publish again.`,
            'conflict',
          );
        }

        if (attempt === MERGE_ATTEMPTS) {
          throw new AdminError(
            'GitHub has not finished processing the last save. Your draft is ' +
              'saved; try publishing again in a moment.',
            'github',
          );
        }

        await sleep(1000 * attempt);
      }
    }

    await deleteBranch(octokit, branch);
  });

/** Close the draft's pull request unmerged and delete its branch */
export const discardDraft = (
  octokit: Octokit,
  collection: Collection,
  slug: string,
): Promise<void> =>
  withGitHub(async () => {
    const branch = draftBranch(collection, slug);
    const draft = await findOpenDraft(octokit, branch);

    if (draft) {
      await octokit.pulls.update({
        owner,
        repo,
        pull_number: draft.number,
        state: 'closed',
      });
    }

    await deleteBranch(octokit, branch);
  });

/**
 * Whether this token's user can push to the repository. Decides who may sign
 * in to the portal at all.
 */
export const canWriteToRepository = async (token: string): Promise<boolean> => {
  try {
    const { data } = await createOctokit(token).repos.get({ owner, repo });

    return data.permissions?.push === true;
  } catch {
    // No access at all, including a GitHub App that is not installed on it.
    return false;
  }
};
