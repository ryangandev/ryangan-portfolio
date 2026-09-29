'use server';

import React from 'react';

import { renderContentPreview } from '@/components/admin/content-preview';
import { compileMdx } from '@/components/mdx/mdx-components';
import { siteUrl } from '@/data/site';
import {
  ContentFrontmatter,
  parseContentFile,
  serializeContentFile,
  toFormValues,
  toFrontmatter,
} from '@/lib/admin/content-file';
import { AdminError } from '@/lib/admin/errors';
import { formatContentFile } from '@/lib/admin/format';
import { getGitHubToken } from '@/lib/admin/github-token';
import { createImageUploadAuth, ImageUploadAuth } from '@/lib/admin/imagekit';
import {
  createOctokit,
  discardDraft,
  Draft,
  publishDraft,
  saveDraft,
} from '@/lib/admin/repository';
import { getAdmin } from '@/lib/admin/session';
import { Collection, collections, isCollection } from '@/lib/collections';
import {
  ContentFormValues,
  contentFormSchemas,
} from '@/schemas/admin-content-schema';

/*
 * Every action here is a public endpoint, like any server action, so each one
 * checks for a signed-in admin itself before doing anything. The editor's own
 * validation is a convenience; everything is validated again here.
 */

export type ActionFailure = {
  ok: false;
  error: string;
  /** Signing in again would fix it */
  reauthorize?: boolean;
};

type ActionResult<T> = ({ ok: true } & T) | ActionFailure;

const signedOut: ActionFailure = {
  ok: false,
  error: 'You are signed out. Sign in again to continue.',
  reauthorize: true,
};

const failure = (error: unknown): ActionFailure => {
  if (error instanceof AdminError) {
    return {
      ok: false,
      error: error.message,
      reauthorize: error.kind === 'reauthorize' || undefined,
    };
  }

  console.error('Admin action failed:', error);

  return {
    ok: false,
    error: 'Something went wrong. Check the server logs, then try again.',
  };
};

const assertCollection = (collection: string): Collection => {
  if (!isCollection(collection)) {
    throw new AdminError(`Unknown collection "${collection}"`, 'invalid');
  }

  return collection;
};

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

/**
 * Validate what the editor submitted and turn it into the file to commit
 * @returns the formatted file, and the form values it corresponds to, which
 *          is what the editor shows once saved
 */
const prepareContentFile = async <C extends Collection>(
  collection: C,
  submitted: unknown,
) => {
  const form = contentFormSchemas[collection].safeParse(submitted);

  if (!form.success) {
    throw new AdminError(
      `Fix these fields first: ${form.error.issues
        .map((issue) => `${issue.path.join('.')} (${issue.message})`)
        .join(', ')}`,
      'invalid',
    );
  }

  const values = form.data as ContentFormValues[C];
  // What the build will check. The form schemas extend these, so this only
  // fails if they have drifted apart.
  const frontmatter = collections[collection].schema.parse(
    toFrontmatter(collection, values),
  ) as ContentFrontmatter[C];

  try {
    await compileMdx(values.body);
  } catch (error) {
    throw new AdminError(
      `The body is not valid MDX: ${errorMessage(error)}`,
      'invalid',
    );
  }

  const content = await formatContentFile(
    serializeContentFile(collection, frontmatter, values.body),
  );
  const saved = parseContentFile(collection, content);

  return {
    values: toFormValues(
      collection,
      values.slug,
      saved.frontmatter,
      saved.body,
    ),
    content,
  };
};

type SaveInput = {
  collection: Collection;
  values: unknown;
  /** Blob id of the file the editor loaded, or null for a new item */
  baseSha: string | null;
};

export type Saved<C extends Collection = Collection> = {
  values: ContentFormValues[C];
  sha: string;
  draft: Draft;
  /** False when nothing had changed since the last save */
  committed: boolean;
};

const save = async ({ collection: name, values, baseSha }: SaveInput) => {
  const admin = await getAdmin();

  if (!admin) {
    return null;
  }

  const collection = assertCollection(name);
  const prepared = await prepareContentFile(collection, values);
  const octokit = createOctokit(await getGitHubToken(admin.id));
  const saved = await saveDraft(octokit, {
    collection,
    slug: prepared.values.slug,
    title: prepared.values.title,
    content: prepared.content,
    baseSha,
  });

  return { octokit, collection, saved: { ...saved, values: prepared.values } };
};

/**
 * Save the item as a draft: commit it to its branch and open the draft pull
 * request if there is none yet
 */
export const saveContentAction = async (
  input: SaveInput,
): Promise<ActionResult<Saved>> => {
  try {
    const result = await save(input);

    return result ? { ok: true, ...result.saved } : signedOut;
  } catch (error) {
    return failure(error);
  }
};

/**
 * Save the item, then publish it by merging its draft into `main`
 * @returns the address the item will have once Vercel has deployed
 */
export const publishContentAction = async (
  input: SaveInput,
): Promise<
  ActionResult<{ url: string }> | (ActionFailure & { saved: Saved })
> => {
  try {
    const result = await save(input);

    if (!result) {
      return signedOut;
    }

    const { octokit, collection, saved } = result;

    try {
      await publishDraft(octokit, {
        collection,
        slug: saved.values.slug,
        draft: saved.draft,
        headSha: saved.draft.headSha,
      });
    } catch (error) {
      // The save went through even though the merge did not, and the editor
      // has to know, or its next save would be refused as out of date.
      return { ...failure(error), saved };
    }

    return {
      ok: true,
      url: `${siteUrl}${collections[collection].sitePath}/${saved.values.slug}`,
    };
  } catch (error) {
    return failure(error);
  }
};

/** Close the item's draft without publishing it */
export const discardDraftAction = async (input: {
  collection: Collection;
  slug: string;
}): Promise<ActionResult<object>> => {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return signedOut;
    }

    const octokit = createOctokit(await getGitHubToken(admin.id));

    await discardDraft(octokit, assertCollection(input.collection), input.slug);

    return { ok: true };
  } catch (error) {
    return failure(error);
  }
};

/**
 * Render the item as its page will show it, from the editor's current values,
 * valid or not
 */
export const previewContentAction = async (input: {
  collection: Collection;
  values: Record<string, unknown>;
}): Promise<ActionResult<{ preview: React.ReactNode }>> => {
  try {
    if (!(await getAdmin())) {
      return signedOut;
    }

    return {
      ok: true,
      preview: await renderContentPreview(
        assertCollection(input.collection),
        input.values,
      ),
    };
  } catch (error) {
    return failure(error);
  }
};

/** Sign one browser upload to ImageKit */
export const createImageUploadAuthAction = async (): Promise<
  ActionResult<{ auth: ImageUploadAuth }>
> => {
  if (!(await getAdmin())) {
    return signedOut;
  }

  const auth = createImageUploadAuth();

  return auth
    ? { ok: true, auth }
    : { ok: false, error: 'Image uploads are not configured.' };
};
