'use client';

import { useSyncExternalStore } from 'react';

import { MdxHeading } from '@/components/mdx/mdx-components';
import { cn } from '@/lib/utils';

/**
 * A heading becomes the current section once its top passes this far down the
 * viewport: just below where `scroll-mt-20` parks a heading jumped to from here,
 * so clicking an entry always highlights that entry.
 */
const ACTIVE_LINE_PX = 96;

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
};

const getActiveId = (headings: MdxHeading[]): string | null => {
  const root = document.documentElement;

  // The last sections can be too short to ever reach the line, so the bottom
  // of the page belongs to the last heading.
  if (window.innerHeight + window.scrollY >= root.scrollHeight - 2) {
    return headings.at(-1)?.id ?? null;
  }

  let activeId: string | null = null;

  for (const heading of headings) {
    const element = document.getElementById(heading.id);

    if (!element || element.getBoundingClientRect().top > ACTIVE_LINE_PX) {
      break;
    }

    activeId = heading.id;
  }

  return activeId;
};

type TableOfContentsProps = {
  headings: MdxHeading[];
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  // The scroll position is state owned by the browser, so it is read through
  // useSyncExternalStore rather than mirrored into React state by an effect.
  const activeId = useSyncExternalStore(
    subscribe,
    () => getActiveId(headings),
    () => null,
  );

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-medium color-level-2">On this page</p>
      <ul className="border-l">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                aria-current={isActive ? 'location' : undefined}
                className={cn(
                  '-ml-px block border-l py-1 pl-3 leading-5 transition-colors',
                  isActive
                    ? 'border-neutral-900 color-level-1 dark:border-neutral-100'
                    : 'border-transparent color-level-5 hover:color-level-3',
                )}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
