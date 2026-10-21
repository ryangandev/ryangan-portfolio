import type { SocialIconName } from '@/models/data';

/**
 * Canonical site identity, shared by `metadataBase`, the sitemap, and robots.
 *
 * These three have to agree on the origin or the sitemap advertises URLs that
 * do not match the canonical ones, so it lives in one place rather than being
 * retyped per route.
 */
export const siteUrl = 'https://ryangan.me';

export const siteName = 'Ryan Gan';

export const siteTitle = 'Ryan Gan - Software Engineer';

/** Every page's title but the home page's: "Blog - Ryan Gan" */
export const pageTitle = (name: string): string => `${name} - ${siteName}`;

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

export const blogTitle = pageTitle('Blog');

export const blogDescription =
  "Notes on things I've built and what I learned building them.";

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

/**
 * The profiles the contact page lists, and the home page's schema.org
 * `sameAs`, in the order the contact page shows them
 */
export const authorProfiles: {
  name: string;
  icon: SocialIconName;
  handle: string;
  url: string;
}[] = [
  {
    name: 'GitHub',
    icon: 'github',
    handle: 'ryangandev',
    url: 'https://github.com/ryangandev',
  },
  {
    name: 'LinkedIn',
    icon: 'linkedin',
    handle: 'ryangan1',
    url: 'https://www.linkedin.com/in/ryangan1/',
  },
  {
    name: 'Medium',
    icon: 'medium',
    handle: '@ryangan.dev',
    url: 'https://medium.com/@ryangan.dev',
  },
];
