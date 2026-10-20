/**
 * The site's design history, for `/admin/history`: each version is a layout,
 * structure, or visual overhaul big enough to be worth remembering, not every
 * change. Screenshots are 1440x900 windows at 2x, in light and dark, taken by
 * running the commit itself, and live on ImageKit under `/Design-History`, a
 * folder to a version. A whole page is 1.5x, since ImageKit serves no original
 * over 25 megapixels.
 */

export type DesignScreenshot = {
  /** The page as the version named it, such as "Home" or "A post" */
  page: string;
  light: string;
  dark: string;
  /** The whole page rather than its first screen */
  fullPage?: boolean;
};

export type DesignVersion = {
  version: string;
  /** `YYYY-MM-DD`, the day of the commit the screenshots come from */
  date: string;
  /** The commit the screenshots come from */
  commit: string;
  title: string;
  summary: string;
  /** What the version was built with, framework first */
  stack: string[];
  screenshots: DesignScreenshot[];
};

/** A sentence or two on how the site got to where it is */
export const designHistoryOverview =
  'Three versions so far. The first, in 2023, was one scrolling page of animated sections. The second, in 2024, split it into pages, added projects in MDX and a blog, and found the quiet, text-first look the site has kept. The third, in 2026, rebuilt it on Next.js 16 and Tailwind 4, added an admin portal, and has since been refining one reading layout for posts and projects.';

/** Oldest first */
export const designHistory: DesignVersion[] = [
  {
    version: 'v1.0',
    date: '2023-09-24',
    commit: 'd216c9b',
    title: 'One scrolling page',
    summary:
      'The first site was a single page under a pill-shaped navbar: a gradient hero with a waving avatar, then About, Projects, Skills, an Experience timeline, and a contact form. Each section faded and slid in as it scrolled into view.',
    stack: [
      'Next.js 13.4 App Router',
      'React 18',
      'Tailwind CSS 3.3',
      'Framer Motion',
      'MUI',
      'react-vertical-timeline',
      'React Email',
      'Resend',
      'react-icons',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v1-0/v1.0-home-full-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v1-0/v1.0-home-full-dark.png',
        fullPage: true,
      },
    ],
  },
  {
    version: 'v1.1',
    date: '2024-06-17',
    commit: '94ae57c',
    title: 'A NextUI restyle',
    summary:
      'The same single page, restyled with NextUI and left as the end of version 1: project cards with images that open into modals, a typewriter line under the name, a résumé button, and a fuller contact form.',
    stack: [
      'Next.js 14.2',
      'React 18.3',
      'Tailwind CSS 3.4',
      'NextUI 2.4',
      'Framer Motion 11',
      'React Email',
      'Resend',
      'react-icons',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v1-1/v1.1-home-full-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v1-1/v1.1-home-full-dark.png',
        fullPage: true,
      },
    ],
  },
  {
    version: 'v2.0',
    date: '2024-09-17',
    commit: '0026b86',
    title: 'Pages behind a header',
    summary:
      'A rebuild from scratch as separate pages behind a Home, Portfolio, and Contact header. The home page shrank to a few lines of text, projects became MDX case studies behind searchable cards, and light and dark themes arrived.',
    stack: [
      'Next.js 14.2',
      'React 18.3',
      'Tailwind CSS 3.4',
      'shadcn/ui on Radix',
      'next-themes',
      'next-mdx-remote',
      'Geist',
      'Prisma 5',
      'React Hook Form',
      'Zod',
      'Resend',
      'Vercel Analytics',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-home-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-home-dark.png',
      },
      {
        page: 'Portfolio',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-portfolio-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-portfolio-dark.png',
      },
      {
        page: 'Grapple Grub',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-portfolio-grapple-grub-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-portfolio-grapple-grub-dark.png',
      },
      {
        page: 'Contact',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-contact-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-0/v2.0-contact-dark.png',
      },
    ],
  },
  {
    version: 'v2.1',
    date: '2024-09-23',
    commit: 'e889b94',
    title: 'Text first, and a blog',
    summary:
      'A week later the header gave way to a back link in the left margin, and a reworked type scale and greys set the minimal, text-first look the site still keeps. The home page gained About Me and featured projects, the blog arrived, and pages changed with view transitions.',
    stack: [
      'Next.js 14.2',
      'React 18.3',
      'Tailwind CSS 3.4',
      'shadcn/ui on Radix',
      'next-themes',
      'next-view-transitions',
      'next-mdx-remote',
      'rehype-pretty-code',
      'Geist',
      'Prisma 5',
      'Resend',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-home-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-home-dark.png',
      },
      {
        page: 'Portfolio',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-portfolio-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-portfolio-dark.png',
      },
      {
        page: 'Grapple Grub',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-portfolio-grapple-grub-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-portfolio-grapple-grub-dark.png',
      },
      {
        page: 'Blog',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-blog-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-blog-dark.png',
      },
      {
        page: 'A post',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-blog-handle-form-loading-states-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v2-1/v2.1-blog-handle-form-loading-states-dark.png',
      },
    ],
  },
  {
    version: 'v3.0',
    date: '2026-09-30',
    commit: '7f5ea18',
    title: 'Rebuilt on Next.js 16',
    summary:
      "After two quiet years, the site moved to Next.js 16, React 19, and Tailwind 4 and went through a full audit. The home page gained Experience and Writing, posts gained a table of contents, reading time, and view counts, Connect and the 404 page were redesigned in the site's own style, and an admin portal for writing posts and projects arrived.",
    stack: [
      'Next.js 16.3',
      'React 19.3',
      'Tailwind CSS 4',
      'Prisma 7 on Neon',
      'Auth.js',
      'Octokit',
      'next-mdx-remote',
      'rehype-pretty-code',
      'Geist',
      'Resend',
      'Vercel Analytics and Speed Insights',
      'Vitest',
      'Playwright',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-home-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-home-dark.png',
      },
      {
        page: 'Portfolio',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-portfolio-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-portfolio-dark.png',
      },
      {
        page: 'Grapple Grub',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-portfolio-grapple-grub-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-portfolio-grapple-grub-dark.png',
      },
      {
        page: 'A post',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-blog-handle-form-loading-states-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-blog-handle-form-loading-states-dark.png',
      },
      {
        page: 'Connect',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-contact-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-0/v3.0-contact-dark.png',
      },
    ],
  },
  {
    version: 'v3.1',
    date: '2026-10-18',
    commit: 'c4dfcd2',
    title: 'A portfolio in rows',
    summary:
      "The portfolio's cards and search became rows grouped by year, with a preview of the hovered project beside them. A project page put its contents under the back link and its facts in a sticky right column, the footer offered Light, System, and Dark, and admin sign-in moved to Better Auth.",
    stack: [
      'Next.js 16.4',
      'React 19.3',
      'Tailwind CSS 4',
      'Prisma 7 on Neon',
      'Better Auth',
      'Octokit',
      'MDX compiled with @mdx-js/mdx',
      'rehype-pretty-code',
      'Geist',
      'Resend',
      'Vitest',
      'Playwright',
    ],
    screenshots: [
      {
        page: 'Home',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-home-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-home-dark.png',
      },
      {
        page: 'Portfolio',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-portfolio-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-portfolio-dark.png',
      },
      {
        page: 'Penny Diary',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-portfolio-penny-diary-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-portfolio-penny-diary-dark.png',
      },
      {
        page: 'A post',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-blog-handle-form-loading-states-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-1/v3.1-blog-handle-form-loading-states-dark.png',
      },
    ],
  },
  {
    version: 'v3.2',
    date: '2026-10-20',
    commit: '0650c28',
    title: 'One layout for posts and projects',
    summary:
      'Posts took on the project layout: facts under the back link on the left, contents on the right, and from 1024px only the contents. Screenshots open full size in an image viewer, pages cross-fade in place, and this site joined its own portfolio.',
    stack: [
      'Next.js 16.4',
      'React 19.3',
      'Tailwind CSS 4',
      'Prisma 7 on Neon',
      'Better Auth',
      'Octokit',
      'MDX compiled with @mdx-js/mdx',
      'Shiki',
      'Geist',
      'Resend',
      'Vitest',
      'Playwright',
    ],
    screenshots: [
      {
        page: 'Portfolio',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-portfolio-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-portfolio-dark.png',
      },
      {
        page: 'Penny Diary',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-portfolio-penny-diary-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-portfolio-penny-diary-dark.png',
      },
      {
        page: 'A post',
        light:
          'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-blog-local-first-sync-and-report-parity-light.png',
        dark: 'https://ik.imagekit.io/ryangan/Design-History/v3-2/v3.2-blog-local-first-sync-and-report-parity-dark.png',
      },
    ],
  },
];
