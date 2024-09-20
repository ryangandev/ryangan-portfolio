import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

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
 * Get a list of all project slugs in the projects directory
 * @returns Array of slugs for each project. Ex: ['project-1', 'project-2']
 */
export const getAllProjectSlugs = async (): Promise<string[]> => {
  const files = await fs.promises.readdir(projectsDirectory);
  const slugs = files.map((fileName) => fileName.replace(/\.mdx$/, ''));

  return slugs;
};

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

  return projects.sort((a, b) =>
    new Date(a.date) > new Date(b.date) ? -1 : 1,
  );
};

/**
 * @returns Array of project metadata  for each project that are sorted by date from newest to oldest
 */
export const getFeaturedProjects = async (): Promise<ProjectMetadata[]> => {
  const slug = await getAllProjectSlugs();
  const projects = await Promise.all(
    slug.map(async (slug) => {
      const fullPath = path.join(projectsDirectory, slug + '.mdx');
      const fileContents = await fs.promises.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<ProjectMetadata, 'slug'>),
      };
    }),
  );

  return projects
    .filter((project) => project.featured)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? -1 : 1));
};

/**
 * Get a list of all post slugs in the posts directory
 * @returns Array of slugs for each post. Ex: ['post-1', 'post-2']
 */
export const getAllPostSlugs = async (): Promise<string[]> => {
  const files = await fs.promises.readdir(postsDirectory);
  const slugs = files.map((fileName) => fileName.replace(/\.mdx$/, ''));

  return slugs;
};

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
    posts.map((post) => new Date(post.publishedDate).getFullYear()),
  );

  return {
    posts: posts.sort((a, b) =>
      new Date(a.publishedDate) > new Date(b.publishedDate) ? -1 : 1,
    ),
    years: Array.from(yearsSet).sort((a, b) => b - a),
  };
};
