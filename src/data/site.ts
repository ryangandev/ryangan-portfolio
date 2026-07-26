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
