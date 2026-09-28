import { describe, expect, it } from 'vitest';

import {
  getAllPostSlugs,
  getAllProjectSlugs,
  getFeaturedProjects,
  getPostBySlug,
  getProjectBySlug,
  getSortedPosts,
  getSortedProjects,
} from '@/lib/content';
import { parseContentDate } from '@/lib/date';

// These run against the real files in src/content, so they assert properties
// that must hold for any content rather than specific titles or counts.

const time = (value: string) => parseContentDate(value).getTime();

describe('content readers', () => {
  it('parses every post and project in the repository', async () => {
    const posts = await Promise.all(
      (await getAllPostSlugs()).map(getPostBySlug),
    );
    const projects = await Promise.all(
      (await getAllProjectSlugs()).map(getProjectBySlug),
    );

    expect(posts.length).toBeGreaterThan(0);
    expect(projects.length).toBeGreaterThan(0);
    expect(posts).not.toContain(null);
    expect(projects).not.toContain(null);
  });

  it('returns null for a slug with no file, including path traversal', async () => {
    expect(await getPostBySlug('no-such-post')).toBeNull();
    expect(
      await getProjectBySlug('../posts/commonly-used-functions'),
    ).toBeNull();
  });

  it('sorts posts newest first and lists their years newest first', async () => {
    const { posts, years } = await getSortedPosts();
    const times = posts.map((post) => time(post.publishedDate));

    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(years).toEqual([...new Set(years)].sort((a, b) => b - a));
    expect(new Set(years)).toEqual(
      new Set(
        posts.map((post) => parseContentDate(post.publishedDate).getFullYear()),
      ),
    );
  });

  it('leaves bodies out of the lists', async () => {
    const { posts } = await getSortedPosts();
    const projects = await getSortedProjects();

    for (const item of [...posts, ...projects]) {
      expect(item).not.toHaveProperty('content');
    }
  });

  it('sorts projects newest first, and featured ones in the same order', async () => {
    const projects = await getSortedProjects();
    const featured = await getFeaturedProjects();
    const times = projects.map((project) => time(project.date));

    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(featured).toEqual(projects.filter((project) => project.featured));
  });
});
