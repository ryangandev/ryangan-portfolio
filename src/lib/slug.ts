import { z } from 'zod';

/**
 * Lowercase words joined by single hyphens: "Grapple Grub" becomes
 * `grapple-grub`. Anything that is not a letter or a digit separates words.
 */
export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/**
 * A post or project slug, which becomes both a file name and a URL segment.
 *
 * `new` is reserved because `/admin/posts/new` is the editor for a post that
 * does not exist yet, so a post with that slug could never be opened.
 */
export const SlugSchema = z
  .string()
  .max(80, { message: 'Keep the slug under 80 characters' })
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Use lowercase letters, digits, and single hyphens',
  })
  .refine((slug) => slug !== 'new', { message: '"new" is reserved' });
