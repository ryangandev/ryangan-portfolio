import fs from 'fs';
import path from 'path';
import { cache } from 'react';
import matter from 'gray-matter';
import { z } from 'zod';

import { parseContentDate } from '@/lib/date';
import { getReadingTime } from '@/lib/reading-time';
import { toTopicSlug } from '@/lib/topics';
import { PostData, PostMetadata, Topic } from '@/models/post';
import { ProjectData, ProjectMetadata } from '@/models/project';
import {
  PostFrontmatterSchema,
  ProjectFrontmatterSchema,
} from '@/schemas/content-schema';

// Literal segments rather than the paths in `src/lib/collections.ts`: the
// bundler only scopes file tracing to a directory it can read statically, and
// otherwise ships the whole project with every server function.
const contentDirectory = path.join(process.cwd(), 'src', 'content');
const projectsDirectory = path.join(contentDirectory, 'projects');
const postsDirectory = path.join(contentDirectory, 'posts');

/*
 * Every reader below is wrapped in React's `cache()`, which memoizes per
 * request. Rendering one post calls `getPostBySlug` from both
 * `generateMetadata` and the page component, and the index pages read every
 * file; without the cache each of those went back to the filesystem.
 */

/**
 * List the slugs of every `.mdx` file in a content directory.
 *
 * The extension filter is what keeps the build honest. Without it every entry
 * `readdir` returns became a slug, so a stray `.DS_Store` (which macOS creates
 * in any directory Finder has visited) turned into a post with no frontmatter,
 * and the undefined date it produced took down `pnpm build` with a RangeError
 * from `format`. Git ignores those files, so CI never saw it and only local
 * builds broke.
 */
const getSlugs = cache(async (directory: string): Promise<string[]> => {
  const files = await fs.promises.readdir(directory);

  return files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''))
    .sort();
});

/**
 * Read one MDX file and validate its frontmatter
 * @throws when the frontmatter does not match the schema, naming the file and
 *         each offending field, so a content mistake fails the build
 */
const readContentFile = async <Schema extends z.ZodType>(
  directory: string,
  slug: string,
  schema: Schema,
): Promise<{ frontmatter: z.output<Schema>; content: string }> => {
  const filePath = path.join(directory, `${slug}.mdx`);
  const { data, content } = matter(
    await fs.promises.readFile(filePath, 'utf8'),
  );
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${path.relative(process.cwd(), filePath)}\n` +
        z.prettifyError(result.error),
    );
  }

  return { frontmatter: result.data, content };
};

const newestFirst = <T>(getDate: (item: T) => string) => {
  return (a: T, b: T) =>
    parseContentDate(getDate(b)).getTime() -
    parseContentDate(getDate(a)).getTime();
};

/**
 * Get a list of all project slugs in the projects directory
 * @returns Array of slugs for each project. Ex: ['project-1', 'project-2']
 */
export const getAllProjectSlugs = async (): Promise<string[]> =>
  getSlugs(projectsDirectory);

/**
 * Read a project once per request, keeping its metadata and body apart so the
 * lists can take the metadata alone
 * @returns null when no project has this slug
 */
const loadProject = cache(
  async (
    slug: string,
  ): Promise<{ metadata: ProjectMetadata; content: string } | null> => {
    // Checked against the directory listing rather than trusted, since the
    // slug may come from a request and is about to become a file path.
    if (!(await getAllProjectSlugs()).includes(slug)) {
      return null;
    }

    const { frontmatter, content } = await readContentFile(
      projectsDirectory,
      slug,
      ProjectFrontmatterSchema,
    );

    return { metadata: { slug, ...frontmatter }, content };
  },
);

/**
 * Get metadata and content of a project by slug
 * @param slug a project slug, possibly straight from the URL
 * @returns The project, or null when no project has this slug
 */
export const getProjectBySlug = async (
  slug: string,
): Promise<ProjectData | null> => {
  const project = await loadProject(slug);

  return project && { ...project.metadata, content: project.content };
};

/**
 * @returns Metadata for every project, newest first. Bodies are left out:
 *          the portfolio list is a client component, and everything returned
 *          here is serialized into its props.
 */
export const getSortedProjects = cache(async (): Promise<ProjectMetadata[]> => {
  const slugs = await getAllProjectSlugs();
  const projects = await Promise.all(slugs.map(loadProject));

  return projects
    .filter((project) => project !== null)
    .map((project) => project.metadata)
    .sort(newestFirst((project) => project.date));
});

/**
 * Projects flagged `featured` in their frontmatter, newest first.
 *
 * Deliberately a filter over `getSortedProjects` rather than its own read loop.
 * It used to be a copy of one, and the two comparators drifted: this function's
 * was the inverse of the other, so the home page listed featured projects
 * oldest first while the portfolio page listed them newest first.
 */
export const getFeaturedProjects = async (): Promise<ProjectMetadata[]> => {
  const projects = await getSortedProjects();

  return projects.filter((project) => project.featured);
};

/**
 * Get a list of all post slugs in the posts directory
 * @returns Array of slugs for each post. Ex: ['post-1', 'post-2']
 */
export const getAllPostSlugs = async (): Promise<string[]> =>
  getSlugs(postsDirectory);

/**
 * Read a post once per request, keeping its metadata and body apart so the
 * lists can take the metadata alone
 * @returns null when no post has this slug
 */
const loadPost = cache(
  async (
    slug: string,
  ): Promise<{ metadata: PostMetadata; content: string } | null> => {
    if (!(await getAllPostSlugs()).includes(slug)) {
      return null;
    }

    const { frontmatter, content } = await readContentFile(
      postsDirectory,
      slug,
      PostFrontmatterSchema,
    );

    return { metadata: { slug, ...frontmatter }, content };
  },
);

/**
 * Get metadata and content of a post by slug
 * @param slug a post slug, possibly straight from the URL
 * @returns The post, or null when no post has this slug
 */
export const getPostBySlug = async (slug: string): Promise<PostData | null> => {
  const post = await loadPost(slug);

  return (
    post && {
      ...post.metadata,
      content: post.content,
      readingTime: getReadingTime(post.content),
    }
  );
};

/**
 * @returns Metadata for every post, newest first, without the bodies
 */
export const getSortedPosts = cache(async (): Promise<PostMetadata[]> => {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(slugs.map(loadPost));

  return posts
    .filter((post) => post !== null)
    .map((post) => post.metadata)
    .sort(newestFirst((post) => post.publishedDate));
});

/**
 * Posts for the home page: the ones flagged `featured`, newest first, or the
 * newest few when none are flagged, so the section is never empty.
 */
export const getFeaturedPosts = async (
  fallbackCount = 2,
): Promise<PostMetadata[]> => {
  const posts = await getSortedPosts();
  const featured = posts.filter((post) => post.featured);

  return featured.length > 0 ? featured : posts.slice(0, fallbackCount);
};

/**
 * The posts published either side of this one
 * @returns `older` and `newer` neighbours, each null at the ends of the list
 */
export const getAdjacentPosts = async (
  slug: string,
): Promise<{ older: PostMetadata | null; newer: PostMetadata | null }> => {
  const posts = await getSortedPosts();
  const index = posts.findIndex((post) => post.slug === slug);

  if (index === -1) {
    return { older: null, newer: null };
  }

  // Newest first, so the older post is the next one in the list.
  return {
    older: posts[index + 1] ?? null,
    newer: posts[index - 1] ?? null,
  };
};

/**
 * Every topic used by at least one post, with its posts newest first
 * @returns Topics with the most posts first, then alphabetically. Each takes
 *          its display name from the first (newest) post that uses it.
 */
export const getTopics = cache(async (): Promise<Topic[]> => {
  const posts = await getSortedPosts();
  const topics = new Map<string, Topic>();

  for (const post of posts) {
    for (const name of post.topics) {
      const slug = toTopicSlug(name);
      const topic = topics.get(slug) ?? { slug, name, posts: [] };

      if (!topic.posts.includes(post)) {
        topic.posts.push(post);
      }

      topics.set(slug, topic);
    }
  }

  return [...topics.values()].sort(
    (a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name),
  );
});

/**
 * @returns The topic with this slug, or null when no post uses it
 */
export const getTopicBySlug = async (slug: string): Promise<Topic | null> =>
  (await getTopics()).find((topic) => topic.slug === slug) ?? null;
