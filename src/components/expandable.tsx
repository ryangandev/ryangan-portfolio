'use client';

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { GoChevronDown } from 'react-icons/go';

import { cn } from '@/lib/utils';

type ExpandableProps = {
  children: React.ReactNode;
  /**
   * The classes that cut the content short while it is collapsed, such as
   * hiding all but its first few entries. Give them the `scripting:` variant,
   * since without script nothing could expand the content again. The content
   * fades out over its last lines, above the toggle.
   */
  collapsedClassName: string;
  label: string;
};

const DURATION_MS = 700;

/**
 * Content cut short until the reader expands it, and cut short again when they
 * collapse it.
 *
 * The collapsed content ends where `collapsedClassName` ends it, such as after
 * a whole entry, rather than at a fixed height. A fixed height lands somewhere
 * new with every change to the text and at every screen width, and sooner or
 * later on the top edge of the next entry.
 *
 * The cut-off content fades out through a mask rather than under a gradient
 * painted in the page's background color. A painted gradient never quite
 * matches: the dark background, hsl(0 0% 10%), is 25.5 in sRGB, and blended
 * pixels round the other way from the solid page, leaving a visible box.
 *
 * Each toggle animates `max-height` from the height on screen to the new
 * state's, both measured, so a toggle in the middle of an animation carries on
 * from where it is. While collapsing, the collapsed classes wait for the
 * animation to finish, so the content has something to shrink over. Collapsing
 * also scrolls the page along with the shrinking content, keeping the toggle
 * under the pointer instead of leaving the reader far below the section.
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
  const [isCollapsing, setIsCollapsing] = useState(false);

  const toggle = () => {
    const content = contentRef.current!;
    const button = toggleRef.current!;
    const from = content.getBoundingClientRect().height;
    const toggleTop = button.getBoundingClientRect().top;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    animationRef.current?.cancel();
    flushSync(() => {
      setIsExpanded(!isExpanded);
      setIsCollapsing(false);
    });

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

    // Show the whole content again, now that `to` is measured, for the
    // animation to shrink. Nothing paints before the animation clamps it.
    if (isExpanded) flushSync(() => setIsCollapsing(true));

    const animation = content.animate(
      [{ maxHeight: `${from}px` }, { maxHeight: `${to}px` }],
      { duration: DURATION_MS, easing: 'ease-in-out', fill: 'forwards' },
    );

    animationRef.current = animation;

    animation.finished.then(
      () => {
        // Hold the end height until the collapsed classes take over from it.
        if (isExpanded) flushSync(() => setIsCollapsing(false));
        animation.cancel();
      },
      () => {},
    );

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
      <div
        ref={contentRef}
        id={contentId}
        className={cn(
          'overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-var(--fade-height)),transparent)] transition-[--fade-height] duration-500',
          isExpanded ? '[--fade-height:0px]' : '[--fade-height:6rem]',
          !isExpanded && !isCollapsing && collapsedClassName,
          'noscript:[mask-image:none]',
        )}
      >
        {children}
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
