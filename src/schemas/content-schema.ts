import { z } from 'zod';

import { techStackNames } from '@/data/tech-stack';

/**
 * A calendar date written `YYYY-MM-DD`.
 *
 * YAML reads an unquoted `2023-03-20` as a timestamp, which gray-matter hands
 * over as a Date at UTC midnight. Both spellings are accepted and normalized to
 * the string, so quoting stays a matter of style rather than a way to break the
 * build. `z.iso.date()` rejects unpadded (`2023-3-20`) and impossible
 * (`2023-02-30`) dates.
 */
const ContentDate = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.iso.date({ message: 'Expected a zero-padded date, e.g. 2023-03-20' }),
);

const NonEmpty = z.string().trim().min(1);

/**
 * Frontmatter is parsed at the boundary rather than cast, so a missing field, a
 * misspelled key (the objects are strict), or a tech stack slug with no icon
 * fails the build naming the file and the field. Before this, each of those
 * type-checked and then broke at render time, or rendered a placeholder.
 */
export const PostFrontmatterSchema = z.strictObject({
  title: NonEmpty,
  author: NonEmpty,
  publishedDate: ContentDate,
  featured: z.boolean().default(false),
  summary: NonEmpty,
  topics: z.array(NonEmpty).default([]),
});

export const ProjectFrontmatterSchema = z.strictObject({
  title: NonEmpty,
  date: ContentDate,
  featured: z.boolean().default(false),
  role: NonEmpty,
  summary: NonEmpty,
  thumbnailUrl: z.url(),
  techStack: z.array(z.enum(techStackNames)).min(1),
  // Either link may be absent: Grapple Grub and Player 2 Helpdesk have a live
  // site but no public repository.
  link: z
    .strictObject({
      github: z.url().optional(),
      live: z.url().optional(),
    })
    .optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatterSchema>;
