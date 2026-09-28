import { describe, expect, it } from 'vitest';

import {
  PostFrontmatterSchema,
  ProjectFrontmatterSchema,
} from '@/schemas/content-schema';

const post = {
  title: 'A post',
  author: 'Ryan Gan',
  publishedDate: '2024-09-20',
  summary: 'What it is about',
};

const project = {
  title: 'A project',
  date: '2023-10-28',
  role: 'Full-Stack Developer',
  summary: 'What it is',
  thumbnailUrl: 'https://ik.imagekit.io/ryangan/thumbnail.png',
  techStack: ['react', 'typescript'],
};

const issuePaths = (result: {
  error?: { issues: { path: PropertyKey[] }[] };
}) => result.error?.issues.map((issue) => issue.path.join('.'));

describe('PostFrontmatterSchema', () => {
  it('defaults the optional fields', () => {
    expect(PostFrontmatterSchema.parse(post)).toEqual({
      ...post,
      featured: false,
      topics: [],
    });
  });

  it('accepts an unquoted YAML date, which gray-matter hands over as a Date', () => {
    const parsed = PostFrontmatterSchema.parse({
      ...post,
      publishedDate: new Date(Date.UTC(2024, 8, 20)),
    });

    expect(parsed.publishedDate).toBe('2024-09-20');
  });

  it.each(['2024-9-20', '2024-02-30', 'September 20, 2024'])(
    'rejects the date %j',
    (publishedDate) => {
      const result = PostFrontmatterSchema.safeParse({
        ...post,
        publishedDate,
      });

      expect(issuePaths(result)).toEqual(['publishedDate']);
    },
  );

  it('rejects a misspelled key instead of ignoring it', () => {
    const { summary, ...rest } = post;
    const result = PostFrontmatterSchema.safeParse({
      ...rest,
      sumary: summary,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.code).sort()).toEqual([
      'invalid_type',
      'unrecognized_keys',
    ]);
  });

  it('rejects blank required text', () => {
    const result = PostFrontmatterSchema.safeParse({ ...post, title: '   ' });

    expect(issuePaths(result)).toEqual(['title']);
  });
});

describe('ProjectFrontmatterSchema', () => {
  it('accepts a project with no links at all', () => {
    expect(ProjectFrontmatterSchema.parse(project).link).toBeUndefined();
  });

  it('accepts either link on its own', () => {
    const parsed = ProjectFrontmatterSchema.parse({
      ...project,
      link: { live: 'https://example.com' },
    });

    expect(parsed.link).toEqual({ live: 'https://example.com' });
  });

  it('rejects a tech stack slug with no icon', () => {
    const result = ProjectFrontmatterSchema.safeParse({
      ...project,
      techStack: ['react', 'reactjs'],
    });

    expect(issuePaths(result)).toEqual(['techStack.1']);
  });

  it('rejects an empty tech stack', () => {
    const result = ProjectFrontmatterSchema.safeParse({
      ...project,
      techStack: [],
    });

    expect(issuePaths(result)).toEqual(['techStack']);
  });

  it('rejects a thumbnail that is not a URL', () => {
    const result = ProjectFrontmatterSchema.safeParse({
      ...project,
      thumbnailUrl: 'thumbnail.png',
    });

    expect(issuePaths(result)).toEqual(['thumbnailUrl']);
  });
});
