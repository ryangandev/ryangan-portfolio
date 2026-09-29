'use client';

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { GoChevronDown } from 'react-icons/go';

import { cn } from '@/lib/utils';

type ExpandableProps = {
  children: React.ReactNode;
  /**
   * The `max-h-*` class for the collapsed state. The content fades out over
   * its last lines, above the toggle.
   */
  collapsedClassName: string;
  label: string;
};

const DURATION_MS = 700;

/**
 * Content cut off at a fixed height until the reader expands it, and cut off
 * again when they collapse it.
 *
 * Each toggle animates `max-height` from the height on screen to the new
 * state's, both measured, so a toggle in the middle of an animation carries on
 * from where it is. Collapsing scrolls the page along with the shrinking
 * content, keeping the toggle under the pointer instead of leaving the reader
 * far below the section. Without JavaScript nothing is cut off, since nothing
 * could expand it.
 */
const Expandable = ({
  children,
  collapsedClassName,
  label,
}: ExpandableProps) => {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggle = () => {
    const content = contentRef.current!;
    const button = toggleRef.current!;
    const from = content.getBoundingClientRect().height;
    const toggleTop = button.getBoundingClientRect().top;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    animationRef.current?.cancel();
    flushSync(() => setIsExpanded(!isExpanded));

    const to = content.getBoundingClientRect().height;

    // Undo however far the toggle has moved. `instant`, because the page
    // otherwise scrolls smoothly and would trail behind.
    const holdToggle = () => {
      const drift = button.getBoundingClientRect().top - toggleTop;

      if (drift) {
        window.scrollBy({ top: drift, behavior: 'instant' });
      }
    };

    if (reduceMotion || from === to) {
      if (isExpanded) holdToggle();
      return;
    }

    const animation = content.animate(
      [{ maxHeight: `${from}px` }, { maxHeight: `${to}px` }],
      { duration: DURATION_MS, easing: 'ease-in-out' },
    );

    animationRef.current = animation;

    if (isExpanded) {
      const follow = () => {
        if (animationRef.current !== animation) return;
        holdToggle();
        if (animation.playState === 'running') requestAnimationFrame(follow);
      };

      requestAnimationFrame(follow);
      animation.finished.then(holdToggle, () => {});
    }
  };

  return (
    <div>
      <div className="relative">
        <div
          ref={contentRef}
          id={contentId}
          className={cn(
            'overflow-hidden',
            !isExpanded && collapsedClassName,
            'noscript:max-h-none',
          )}
        >
          {children}
        </div>
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-background transition-opacity duration-500 noscript:hidden',
            isExpanded && 'opacity-0',
          )}
        />
      </div>
      <div className="flex justify-center noscript:hidden">
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={toggle}
          className="flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1 text-sm color-level-4 transition-colors hover:color-level-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
        >
          {isExpanded ? 'Collapse' : label}
          <GoChevronDown
            aria-hidden
            className={cn(
              'size-4 transition-transform duration-300',
              isExpanded && 'rotate-180',
            )}
          />
        </button>
      </div>
    </div>
  );
};

export default Expandable;
