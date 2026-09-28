import { describe, expect, it } from 'vitest';

import {
  getAdjacentPosts,
  getAllPostSlugs,
  getAllProjectSlugs,
  getFeaturedProjects,
  getPostBySlug,
  getProjectBySlug,
  getSortedPosts,
  getSortedProjects,
  getTopicBySlug,
  getTopics,
} from '@/lib/content';
import { parseContentDate } from '@/lib/date';
import { toTopicSlug } from '@/lib/topics';

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

  it('sorts posts newest first', async () => {
    const posts = await getSortedPosts();
    const times = posts.map((post) => time(post.publishedDate));

    expect(times).toEqual([...times].sort((a, b) => b - a));
  });

  it('leaves bodies out of the lists', async () => {
    const posts = await getSortedPosts();
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

describe('getAdjacentPosts', () => {
  it('links each post to the ones published either side of it', async () => {
    const posts = await getSortedPosts();

    for (const [index, post] of posts.entries()) {
      const { older, newer } = await getAdjacentPosts(post.slug);

      expect(older).toEqual(posts[index + 1] ?? null);
      expect(newer).toEqual(posts[index - 1] ?? null);
    }

    expect(await getAdjacentPosts('no-such-post')).toEqual({
      older: null,
      newer: null,
    });
  });
});

describe('topics', () => {
  it('slugs topic names so case and separator variants share a page', () => {
    expect(toTopicSlug('React Hook Form')).toBe('react-hook-form');
    expect(toTopicSlug('react-hook-form')).toBe('react-hook-form');
    expect(toTopicSlug('Next.js')).toBe('next-js');
    expect(toTopicSlug('  C# / .NET  ')).toBe('c-net');
  });

  it('groups every post under each of its topics, newest first', async () => {
    const posts = await getSortedPosts();
    const topics = await getTopics();

    for (const post of posts) {
      for (const name of post.topics) {
        const topic = topics.find((t) => t.slug === toTopicSlug(name));
        expect(topic?.posts).toContainEqual(post);
      }
    }

    for (const topic of topics) {
      const times = topic.posts.map((post) => time(post.publishedDate));
      expect(times).toEqual([...times].sort((a, b) => b - a));
      expect(await getTopicBySlug(topic.slug)).toEqual(topic);
    }

    expect(await getTopicBySlug('no-such-topic')).toBeNull();
  });
});
