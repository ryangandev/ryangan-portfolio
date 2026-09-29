'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { GoChevronDown } from 'react-icons/go';

import { cn } from '@/lib/utils';

type ExpandableProps = {
  children: React.ReactNode;
  /**
   * The `max-h-*` class for the collapsed state. The content fades out over
   * its last lines, where the expand button sits.
   */
  collapsedClassName: string;
  label: string;
};

type State =
  | { name: 'collapsed' }
  | { name: 'expanding'; height: number }
  | { name: 'expanded' };

/**
 * Content cut off at a fixed height until the reader asks for the rest, then
 * grown to its full height.
 *
 * `max-height` cannot animate to `none`, so expanding animates it to the
 * content's measured height and drops the limit once that finishes, leaving
 * the content free to reflow. Without JavaScript nothing is cut off, since
 * nothing could expand it.
 */
const Expandable = ({
  children,
  collapsedClassName,
  label,
}: ExpandableProps) => {
  const contentId = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({ name: 'collapsed' });

  useEffect(() => {
    // The button is gone, so keyboard focus moves to what it revealed.
    if (state.name === 'expanded') {
      contentRef.current?.focus({ preventScroll: true });
    }
  }, [state.name]);

  const expand = () => {
    const content = contentRef.current!;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    // Without a transition no transitionend fires, so finish straight away.
    if (reduceMotion || content.scrollHeight <= content.clientHeight) {
      setState({ name: 'expanded' });
    } else {
      setState({ name: 'expanding', height: content.scrollHeight });
    }
  };

  return (
    <div className="relative">
      <div
        ref={contentRef}
        id={contentId}
        tabIndex={-1}
        style={
          state.name === 'expanding'
            ? { maxHeight: `${state.height}px` }
            : undefined
        }
        onTransitionEnd={(event) => {
          if (
            event.target === event.currentTarget &&
            event.propertyName === 'max-height'
          ) {
            setState({ name: 'expanded' });
          }
        }}
        className={cn(
          'overflow-hidden transition-[max-height] duration-700 ease-in-out outline-none',
          state.name !== 'expanded' && collapsedClassName,
          'noscript:max-h-none',
        )}
      >
        {children}
      </div>
      {state.name !== 'expanded' && (
        <div
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 flex h-32 items-end justify-center bg-linear-to-b from-transparent to-background to-70% pb-1 transition-opacity duration-500 noscript:hidden',
            state.name === 'expanding' && 'opacity-0',
          )}
        >
          <button
            type="button"
            aria-expanded={state.name === 'expanding'}
            aria-controls={contentId}
            onClick={expand}
            disabled={state.name === 'expanding'}
            className="pointer-events-auto flex items-center gap-1.5 rounded-full border bg-background px-3.5 py-1 text-sm color-level-4 transition-colors hover:color-level-2 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden"
          >
            {label}
            <GoChevronDown aria-hidden className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Expandable;
