/**
 * Canonical site identity, shared by `metadataBase`, the sitemap, and robots.
 *
 * These three have to agree on the origin or the sitemap advertises URLs that
 * do not match the canonical ones, so it lives in one place rather than being
 * retyped per route.
 */
export const siteUrl = 'https://ryangan.me';

export const siteName = 'Ryan Gan';

export const siteTitle = 'Ryan Gan | Software Engineer';

export const siteDescription =
  'My name is Ryan Gan and I am a Software Engineer.';

export const authorAvatarUrl =
  'https://ik.imagekit.io/ryangan/profile-icon.jpeg?updatedAt=1718985313938';

/**
 * `sizes` values for images that span the content column.
 *
 * The column is `max-w-[692px]` with `px-6` on each side, so an image in it is
 * 644px wide once the viewport reaches 692px and `100vw - 48px` below that.
 * Without an accurate `sizes`, next/image assumes `100vw` and ships the
 * largest variant to every screen.
 */
export const contentImageSizes = '(min-width: 692px) 644px, calc(100vw - 48px)';
