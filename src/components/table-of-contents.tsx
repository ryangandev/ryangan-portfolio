'use client';

import { useLayoutEffect, useRef, useSyncExternalStore } from 'react';

import InPageLink from '@/components/in-page-link';
import { MdxHeading } from '@/components/mdx/mdx-components';
import { cn, isPlainClick } from '@/lib/utils';

/**
 * A heading becomes the current section once its top passes this far down the
 * viewport: just below where `scroll-mt-20` parks a heading jumped to from here,
 * so clicking an entry always highlights that entry.
 */
const ACTIVE_LINE_PX = 96;

/**
 * How long the page must go without scrolling for a jump to count as over.
 * `scrollend` would say so sooner, but Safari does not fire it.
 */
const SETTLE_MS = 150;

/**
 * The section an entry was clicked for, current until the reader scrolls on
 * their own. Without it, a long jump would mark every section it passes on the
 * way, one after another.
 */
let heldId: string | null = null;
let releaseHold: (() => void) | null = null;
const listeners = new Set<() => void>();

const notify = () => listeners.forEach((listener) => listener());

/**
 * Make `id` the current section at once, ahead of the scroll to it, and keep
 * it so until the reader takes over: by scrolling, a wheel, a touch, or a key
 * during the jump, or by any scroll after it has come to rest. At rest, the
 * scroll alone may not name it, since a short last section never reaches the
 * line.
 */
const holdSection = (id: string) => {
  releaseHold?.();
  heldId = id;
  notify();

  let restingY: number | null = null;
  let settleTimer = window.setTimeout(
    () => (restingY = window.scrollY),
    SETTLE_MS,
  );

  const onScroll = () => {
    if (restingY === null) {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(
        () => (restingY = window.scrollY),
        SETTLE_MS,
      );
    } else if (Math.abs(window.scrollY - restingY) > 1) {
      release();
    }
  };
  const onInput = () => {
    if (restingY === null) {
      release();
    }
  };
  const inputs = ['wheel', 'touchstart', 'keydown'] as const;

  function release() {
    window.clearTimeout(settleTimer);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', release);
    inputs.forEach((type) => window.removeEventListener(type, onInput));
    releaseHold = null;
    heldId = null;
    notify();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', release);
  inputs.forEach((type) =>
    window.addEventListener(type, onInput, { passive: true }),
  );
  releaseHold = release;
};

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);

  return () => {
    listeners.delete(onChange);
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

/**
 * The id of the heading whose section the reader is in, or the one whose entry
 * they just clicked; null above the first, and on the server
 */
export const useActiveHeadingId = (headings: MdxHeading[]) =>
  // The scroll position is state owned by the browser, so it is read through
  // useSyncExternalStore rather than mirrored into React state by an effect.
  useSyncExternalStore(
    subscribe,
    () =>
      heldId !== null && headings.some(({ id }) => id === heldId)
        ? heldId
        : getActiveId(headings),
    () => null,
  );

type TableOfContentsProps = {
  headings: MdxHeading[];
};

/**
 * Where `marker` should sit to mark `entry`: level with it, as tall, and
 * hidden when nothing is marked
 */
const placeMarker = (
  marker: HTMLElement,
  entry: HTMLElement | null,
  animate: boolean,
) => {
  if (!entry) {
    marker.style.opacity = '0';
    return;
  }

  const transform = `translateY(${entry.offsetTop}px)`;
  const height = `${entry.offsetHeight}px`;

  if (marker.style.transform === transform && marker.style.height === height) {
    return;
  }

  // Appearing, or following a reflow, it moves at once; only a change of
  // section slides.
  marker.style.transitionDuration =
    animate && marker.style.opacity === '1' ? '' : '0s';
  marker.style.transform = transform;
  marker.style.height = height;
  marker.style.opacity = '1';
};

const TableOfContents = ({ headings }: TableOfContentsProps) => {
  const activeId = useActiveHeadingId(headings);
  const listRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);

  // One marker slides from entry to entry, rather than each entry's own edge
  // lighting up in turn.
  useLayoutEffect(() => {
    const list = listRef.current;
    const marker = markerRef.current;

    if (!list || !marker) {
      return;
    }

    const findEntry = () =>
      activeId
        ? list.querySelector<HTMLElement>(`a[href="#${CSS.escape(activeId)}"]`)
        : null;

    placeMarker(marker, findEntry(), true);

    // An entry can change height after the fact, as the font arrives.
    const observer = new ResizeObserver(() =>
      placeMarker(marker, findEntry(), false),
    );

    observer.observe(list);

    return () => observer.disconnect();
  }, [activeId]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 font-medium color-level-2">On this page</p>
      <div ref={listRef} className="relative border-l">
        <span
          ref={markerRef}
          aria-hidden
          data-contents-marker
          className="pointer-events-none absolute top-0 -left-px w-px bg-neutral-900 opacity-0 transition-[transform,height,opacity] duration-300 ease-out motion-reduce:transition-none dark:bg-neutral-100"
        />
        <ul>
          {headings.map((heading) => {
            const isActive = heading.id === activeId;

            return (
              <li key={heading.id}>
                <InPageLink
                  href={`#${heading.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={(event) => {
                    if (isPlainClick(event)) {
                      holdSection(heading.id);
                    }
                  }}
                  className={cn(
                    'block py-1 pl-3 leading-5 transition-colors',
                    isActive
                      ? 'color-level-1'
                      : 'color-level-5 hover:color-level-3',
                  )}
                >
                  {heading.text}
                </InPageLink>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default TableOfContents;
