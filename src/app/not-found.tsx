import type { Metadata } from 'next';

import LinkRows from '@/components/link-rows';
import PageSummary from '@/components/page-summary';
import { pageTitle } from '@/data/site';

export const metadata: Metadata = {
  title: pageTitle('Page not found'),
};

const destinations = [
  { href: '/', title: 'Home', summary: 'About me, and my experience' },
  {
    href: '/portfolio',
    title: 'Portfolio',
    summary: "A selection of projects I've worked on",
  },
  {
    href: '/blog',
    title: 'Blog',
    summary: 'Insights and lessons from software development',
  },
  { href: '/contact', title: 'Connect', summary: 'Get in touch' },
];

/**
 * Every unmatched URL, and every `notFound()`. The pages worth landing on
 * instead are listed the way the home page lists featured work, each with its
 * path where the home page puts a year.
 */
const NotFound = () => {
  return (
    <main>
      <p
        aria-hidden
        className="mb-4 text-7xl leading-none font-light tracking-tighter color-level-6 tabular-nums"
      >
        404
      </p>
      <h1>Page not found</h1>
      <PageSummary>
        This page doesn&apos;t exist, or it has moved. Here are a few places to
        pick up from instead.
      </PageSummary>
      <LinkRows
        rows={destinations.map((destination) => ({
          ...destination,
          end: destination.href,
        }))}
      />
    </main>
  );
};

export default NotFound;
