import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

import { PostData, PostMetadata } from '@/models/post';
import { ProjectData, ProjectMetadata } from '@/models/project';

const postsDirectory = path.join(process.cwd(), 'src', 'content', 'posts');
const projectsDirectory = path.join(
  process.cwd(),
  'src',
  'content',
  'projects',
);

export async function getSortedPostsData(): Promise<PostMetadata[]> {
  const fileNames = await fs.promises.readdir(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = await fs.promises.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<PostMetadata, 'slug'>),
      };
    }),
  );

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as Omit<PostMetadata, 'slug'>),
  };
}

export async function getSortedProjectsData(): Promise<ProjectMetadata[]> {
  const fileNames = await fs.promises.readdir(projectsDirectory);
  const allProjectsData = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(projectsDirectory, fileName);
      const fileContents = await fs.promises.readFile(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        slug,
        ...(data as Omit<ProjectMetadata, 'slug'>),
      };
    }),
  );

  return allProjectsData.sort((a, b) => (a.title < b.title ? -1 : 1));
}

export async function getProjectData(slug: string): Promise<ProjectData> {
  const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContents = await fs.promises.readFile(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    content,
    ...(data as Omit<ProjectMetadata, 'slug'>),
  };
}
