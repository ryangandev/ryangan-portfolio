import {
  PostFrontmatterSchema,
  ProjectFrontmatterSchema,
} from '@/schemas/content-schema';

/**
 * The two kinds of content, keyed by their directory under `src/content`.
 *
 * The site reads them from disk at build time (`src/lib/content.ts`, which
 * spells the directories out itself for the bundler); the admin portal reads
 * and writes the same paths in the GitHub repository.
 */
export const collections = {
  posts: {
    /** Repository-relative, with forward slashes, as GitHub paths are */
    directory: 'src/content/posts',
    schema: PostFrontmatterSchema,
    noun: 'post',
    /** Where a published item lives on the site */
    sitePath: '/blog',
    /** ImageKit folder for images uploaded from the editor */
    imageFolder: '/Blog',
  },
  projects: {
    directory: 'src/content/projects',
    schema: ProjectFrontmatterSchema,
    noun: 'project',
    sitePath: '/portfolio',
    // Where the existing project screenshots already live.
    imageFolder: '/Project Screenshots',
  },
} as const;

export type Collection = keyof typeof collections;

export const collectionNames = Object.keys(collections) as Collection[];

export const isCollection = (value: string): value is Collection =>
  Object.hasOwn(collections, value);

/** Repository-relative path of an item's MDX file */
export const contentFilePath = (collection: Collection, slug: string) =>
  `${collections[collection].directory}/${slug}.mdx`;
