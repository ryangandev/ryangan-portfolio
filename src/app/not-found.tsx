import type { Metadata } from 'next';
import { Link } from 'next-view-transitions';

export const metadata: Metadata = {
  title: 'Page not found - Ryan Gan',
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
      <p>
        This page doesn&apos;t exist, or it has moved. Here are a few places to
        pick up from instead.
      </p>
      <ul className="group mb-7 text-[15px]">
        {destinations.map((destination) => (
          <li
            key={destination.href}
            className="py-2 transition-opacity group-hover:opacity-60 hover:!opacity-100"
          >
            <Link href={destination.href} className="flex space-x-2.5">
              <span className="font-medium color-level-2">
                {destination.title}
              </span>
              <span className="hidden color-level-4 md:block">
                {destination.summary}
              </span>
              <div className="mt-3.5 h-px min-w-4 flex-1 bg-border/80"></div>
              <span className="color-level-5">{destination.href}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default NotFound;
