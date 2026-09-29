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

export const blogTitle = 'Blog - Ryan Gan';

export const blogDescription =
  'Insights and lessons from my journey in software development.';

/**
 * Advertises the RSS feed to browsers and feed readers.
 *
 * Next replaces `alternates` wholesale rather than merging it, so a page that
 * sets its own canonical URL drops the layout's feed link unless it spreads
 * this in as well.
 */
export const feedAlternates = {
  types: {
    'application/rss+xml': [{ url: '/feed.xml', title: blogTitle }],
  },
};

/**
 * The repository the site deploys from. Vercel builds `branch`, so the admin
 * portal saves drafts as pull requests into it and publishes by merging them.
 */
export const contentRepository = {
  owner: 'ryangandev',
  name: 'ryangan-portfolio',
  branch: 'main',
} as const;

/** The profiles the contact page links to, in schema.org `sameAs` terms */
export const authorProfiles = [
  'https://github.com/ryangandev',
  'https://www.linkedin.com/in/ryangan1/',
  'https://medium.com/@ryangan.dev',
];
