import { z } from 'zod';

import { SlugSchema } from '@/lib/slug';
import {
  PostFrontmatterSchema,
  ProjectFrontmatterSchema,
} from '@/schemas/content-schema';

/*
 * What the admin editor's forms hold: the frontmatter, plus the slug and the
 * MDX body. They extend the content schemas rather than restating them, so a
 * rule added there (a new required field, a stricter URL) reaches the form
 * without a second edit. Only the fields a form holds differently are
 * redefined here. The server still validates the frontmatter it writes against
 * the content schemas themselves, which are what the build enforces.
 */

/** A date input's value. The content schema also accepts a YAML Date. */
const FormDate = z.iso.date({ message: 'Pick a date' });

/** Empty means "no link", since an input cannot hold undefined */
const OptionalUrl = z.union([
  z.literal(''),
  z.url({ message: 'Expected a full URL, or leave it empty' }),
]);

// Far beyond any real post (the longest is about 16 KB). Server actions take at
// most 1 MB, and at up to three bytes a character this stays under it.
const Body = z.string().max(300_000, { message: 'The body is too long' });

export const PostFormSchema = PostFrontmatterSchema.extend({
  slug: SlugSchema,
  publishedDate: FormDate,
  featured: z.boolean(),
  topics: PostFrontmatterSchema.shape.topics.unwrap(),
  body: Body,
});

export const ProjectFormSchema = ProjectFrontmatterSchema.extend({
  slug: SlugSchema,
  date: FormDate,
  featured: z.boolean(),
  link: z.strictObject({ github: OptionalUrl, live: OptionalUrl }),
  body: Body,
});

export type PostFormValues = z.infer<typeof PostFormSchema>;
export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;

export const contentFormSchemas = {
  posts: PostFormSchema,
  projects: ProjectFormSchema,
} as const;

export type ContentFormValues = {
  posts: PostFormValues;
  projects: ProjectFormValues;
};
