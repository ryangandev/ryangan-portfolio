import { createHash } from 'crypto';
import matter from 'gray-matter';
import { z } from 'zod';

import { Collection, collections } from '@/lib/collections';
import type {
  ContentFormValues,
  PostFormValues,
  ProjectFormValues,
} from '@/schemas/admin-content-schema';
import type {
  PostFrontmatter,
  ProjectFrontmatter,
} from '@/schemas/content-schema';

export type ContentFrontmatter = {
  posts: PostFrontmatter;
  projects: ProjectFrontmatter;
};

/**
 * One YAML value, written in the style the content files already use: flow
 * sequences and mappings rather than block ones.
 *
 * Strings go through `JSON.stringify`, whose output is a valid YAML
 * double-quoted scalar. Prettier then rewrites the quotes to the repository's
 * single-quote style, so the file comes out exactly as a hand-formatted one.
 */
const toYaml = (value: unknown): string => {
  if (typeof value === 'string') {
    return JSON.stringify(value);
  }

  if (typeof value === 'boolean' || typeof value === 'number') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(toYaml).join(', ')}]`;
  }

  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);

    return entries.length === 0
      ? '{}'
      : `{ ${entries.map(([k, v]) => `${k}: ${toYaml(v)}`).join(', ')} }`;
  }

  throw new Error(`Cannot write ${String(value)} into frontmatter`);
};

/**
 * Write an item's MDX file. Keys follow the order of the collection's schema,
 * which is the order every existing file uses; keys left undefined are left
 * out.
 *
 * The output is not yet Prettier-formatted - see `formatContentFile`.
 */
export const serializeContentFile = <C extends Collection>(
  collection: C,
  frontmatter: ContentFrontmatter[C],
  body: string,
): string => {
  const values = frontmatter as Record<string, unknown>;
  const lines = Object.keys(collections[collection].schema.shape)
    .filter((key) => values[key] !== undefined)
    .map((key) => `${key}: ${toYaml(values[key])}`);
  const content = body.trim();

  return `---\n${lines.join('\n')}\n---\n${content ? `\n${content}\n` : ''}`;
};

/**
 * Read an item's MDX file, validating its frontmatter the way the build does
 * @throws when the frontmatter does not match the collection's schema
 */
export const parseContentFile = <C extends Collection>(
  collection: C,
  source: string,
): { frontmatter: ContentFrontmatter[C]; body: string } => {
  const { data, content } = matter(source);
  const result = collections[collection].schema.safeParse(data);

  if (!result.success) {
    throw new Error(z.prettifyError(result.error));
  }

  return {
    frontmatter: result.data as ContentFrontmatter[C],
    body: content.replace(/^\n+/, ''),
  };
};

/** Form values for an item read from its file */
export const toFormValues = <C extends Collection>(
  collection: C,
  slug: string,
  frontmatter: ContentFrontmatter[C],
  body: string,
): ContentFormValues[C] => {
  if (collection === 'projects') {
    const project = frontmatter as ProjectFrontmatter;
    const values: ProjectFormValues = {
      ...project,
      slug,
      link: {
        github: project.link?.github ?? '',
        live: project.link?.live ?? '',
      },
      body,
    };

    return values as ContentFormValues[C];
  }

  const values: PostFormValues = {
    ...(frontmatter as PostFrontmatter),
    slug,
    body,
  };

  return values as ContentFormValues[C];
};

/** The frontmatter a form describes. Empty link fields mean no link. */
export const toFrontmatter = <C extends Collection>(
  collection: C,
  values: ContentFormValues[C],
): ContentFrontmatter[C] => {
  if (collection === 'projects') {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, body, link, ...project } = values as ProjectFormValues;
    const github = link.github || undefined;
    const live = link.live || undefined;
    const frontmatter: ProjectFrontmatter = {
      ...project,
      link: github || live ? { github, live } : undefined,
    };

    return frontmatter as ContentFrontmatter[C];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { slug, body, ...post } = values as PostFormValues;

  return post as ContentFrontmatter[C];
};

/**
 * The id Git gives a file with these contents. GitHub reports a file's blob
 * id as its `sha`, so comparing the two tells whether saving would change
 * anything.
 */
export const gitBlobSha = (content: string): string =>
  createHash('sha1')
    .update(`blob ${Buffer.byteLength(content)}\0`)
    .update(content)
    .digest('hex');
