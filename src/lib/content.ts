import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { parseContentDate } from '@/lib/date';
import { getReadingTime } from '@/lib/reading-time';
import { PostData, PostMetadata } from '@/models/post';
import { ProjectData, ProjectMetadata } from '@/models/project';

const projectsDirectory = path.join(
  process.cwd(),
  'src',
  'content',
  'projects',
);
const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');

/**
 * List the slugs of every `.mdx` file in a content directory.
 *
 * The extension filter is what keeps the build honest. Without it every entry
 * `readdir` returns became a slug, so a stray `.DS_Store` — which macOS creates
 * in any directory Finder has visited — turned into a post with no frontmatter,
 * and the undefined date it produced took down `pnpm build` with a RangeError
 * from `format`. Git ignores those files, so CI never saw it and only local
 * builds broke.
 */
const getSlugs = async (directory: string): Promise<string[]> => {
  const files = await fs.promises.readdir(directory);

  return files
    .filter((fileName) => fileName.endsWith('.mdx'))
    .map((fileName) => fileName.replace(/\.mdx$/, ''));
};

/**
 * Get a list of all project slugs in the projects directory
 * @returns Array of slugs for each project. Ex: ['project-1', 'project-2']
 */
export const getAllProjectSlugs = async (): Promise<string[]> =>
  getSlugs(projectsDirectory);

/**
 * Get metadata and content of a project by slug
 * @param slug a project slug
 * @returns Slug, metadata and content of the project
 */
export const getProjectBySlug = async (slug: string): Promise<ProjectData> => {
  const fileName = slug + '.mdx';
  const fullPath = path.join(projectsDirectory, fileName);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    ...(data as Omit<ProjectMetadata, 'slug'>),
    content,
  };
};

/**
 * @returns Array of project metadata for each project that are sorted by date from newest to oldest
 */
export const getSortedProjects = async (): Promise<ProjectMetadata[]> => {
  const slugs = await getAllProjectSlugs();
  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const fullPath = path.join(projectsDirectory, slug + '.mdx');
      const fileContents = await fs.promises.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<ProjectMetadata, 'slug'>),
      };
    }),
  );

  return projects.sort(
    (a, b) =>
      parseContentDate(b.date).getTime() - parseContentDate(a.date).getTime(),
  );
};

/**
 * Projects flagged `featured` in their frontmatter, newest first.
 *
 * Deliberately a filter over `getSortedProjects` rather than its own read loop.
 * It used to be a copy of one, and the two comparators drifted: this function's
 * was the inverse of the other, so the home page listed featured projects
 * oldest first while the portfolio page listed them newest first.
 *
 * @returns Array of featured project metadata, sorted from newest to oldest
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
 * Get metadata and content of a post by slug
 * @param slug a post slug
 * @returns Slug, metadata and content of the post
 */
export const getPostBySlug = async (slug: string): Promise<PostData> => {
  const fileName = slug + '.mdx';
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    ...(data as Omit<PostMetadata, 'slug'>),
    content,
    readingTime: getReadingTime(content),
  };
};

/**
 * Get all post metadata and unique sorted years
 * @returns An object with an array of sorted posts metadata and an array of unique sorted years
 */
export const getSortedPosts = async (): Promise<{
  posts: PostMetadata[];
  years: number[];
}> => {
  const slugs = await getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const fullPath = path.join(postsDirectory, slug + '.mdx');
      const fileContents = await fs.promises.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<PostMetadata, 'slug'>),
      };
    }),
  );

  const yearsSet: Set<number> = new Set(
    posts.map((post) => parseContentDate(post.publishedDate).getFullYear()),
  );

  return {
    posts: posts.sort(
      (a, b) =>
        parseContentDate(b.publishedDate).getTime() -
        parseContentDate(a.publishedDate).getTime(),
    ),
    years: Array.from(yearsSet).sort((a, b) => b - a),
  };
};
