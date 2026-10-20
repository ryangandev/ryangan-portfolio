'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoArrowLeft } from 'react-icons/go';

import { isPlainClick } from '@/lib/utils';

type BackButtonProps = {
  name: string;
  href: string;
  /**
   * What follows the link down the left-hand gutter from xl up, such as a
   * post's or a project's facts. Below xl it is not shown.
   */
  children?: React.ReactNode;
};

/**
 * The path of the page before this one in the tab, if it was on this site.
 * Only the Navigation API can say; without it, null.
 */
const getPreviousPathname = () => {
  if (!('navigation' in window) || !navigation.currentEntry) {
    return null;
  }

  // `entries()` lists only this site's pages, so another site the reader came
  // from never shows up here.
  const previous = navigation.entries()[navigation.currentEntry.index - 1];

  return previous?.url ? new URL(previous.url).pathname : null;
};

/**
 * The way up to the page this one belongs to. When that is the page the reader
 * just came from, it goes back instead, so the parent returns where it was
 * left, scrolled as it was, and the browser's Back button does not then bounce
 * the reader into the child again. Arriving from anywhere else, it is a plain
 * link up.
 *
 * Below xl it sits above the page's title. From xl up it moves to the
 * left-hand gutter and sticks there, with `children` under it, while the page
 * scrolls. Narrower than xl, a window has no room left of the column for it.
 */
export default function BackButton({ name, href, children }: BackButtonProps) {
  const router = useRouter();

  const goBackIfParent = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (isPlainClick(event) && getPreviousPathname() === href) {
      event.preventDefault();
      router.back();
    }
  };

  return (
    // Spans the page's height from xl up, so the rail inside can stick. It
    // lets clicks through, and only the rail takes them.
    <div className="mb-8 xl:pointer-events-none xl:absolute xl:inset-y-0 xl:right-full xl:mb-0">
      <div className="xl:pointer-events-auto xl:sticky xl:top-32 xl:mr-10 xl:w-48">
        <Link
          href={href}
          onClick={goBackIfParent}
          className="group relative flex h-7 w-fit items-center gap-1.5 text-sm color-level-4 transition-colors after:absolute after:-inset-2 hover:color-level-2"
        >
          <GoArrowLeft
            aria-hidden
            className="size-4 transition-transform group-hover:-translate-x-0.5"
          />
          <span className="sr-only">Back to </span>
          {name}
        </Link>
        {/* The rail sticks 128px down, and what follows the link starts 52px
            below that. Facts taller than a short window scroll on their own
            rather than running off the bottom, out of reach. */}
        {children && (
          <div className="mt-6 hidden max-h-[calc(100dvh-13.25rem)] overflow-y-auto xl:block">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
