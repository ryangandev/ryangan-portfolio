'use client';

import { useSyncExternalStore } from 'react';
import { GoArrowUp } from 'react-icons/go';

import { cn } from '@/lib/utils';

const subscribe = (onChange: () => void) => {
  window.addEventListener('scroll', onChange, { passive: true });
  window.addEventListener('resize', onChange);

  return () => {
    window.removeEventListener('scroll', onChange);
    window.removeEventListener('resize', onChange);
  };
};

/** Shown once the reader is a full screen down, where the top is out of reach */
const isPastFirstScreen = () => window.scrollY > window.innerHeight;

const scrollToTop = () => {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  window.scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' });

  // The button hides at the top, which would drop keyboard focus onto the
  // body. Focus the page's main content instead, so the next Tab starts there.
  const main = document.querySelector('main');

  if (main) {
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
  }
};

/**
 * On every page. From xl up it is a link in the right-hand gutter, the column
 * a post's table of contents uses; below that it is a round button in the
 * corner, clear of the footer.
 */
const BackToTop = () => {
  const isShown = useSyncExternalStore(
    subscribe,
    isPastFirstScreen,
    () => false,
  );

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={cn(
        'fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-40 flex size-10 items-center justify-center rounded-full border bg-background/80 color-level-4 shadow-sm backdrop-blur-sm transition-[color,opacity,translate,visibility] duration-300 hover:color-level-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden',
        // The gutter starts where the post's table of contents does: 40px
        // past the 644px content column.
        'xl:right-auto xl:bottom-16 xl:left-[calc(50%+362px)] xl:size-auto xl:gap-2 xl:rounded-none xl:border-0 xl:bg-transparent xl:text-sm xl:color-level-5 xl:shadow-none xl:backdrop-blur-none xl:hover:color-level-3',
        isShown ? 'visible opacity-100' : 'invisible translate-y-2 opacity-0',
      )}
    >
      <GoArrowUp aria-hidden className="size-4" />
      <span className="hidden xl:inline">Back to top</span>
    </button>
  );
};

export default BackToTop;
