'use client';

import React, { Children, useState } from 'react';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';

import { cn } from '@/lib/utils';

type CustomCodeProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Blocks longer than this collapse behind an expand button.
 *
 * Kept in sync by hand with the `max-h-[calc(50*1lh)]` below — Tailwind class
 * names cannot interpolate a JS value, and expressing the cap in `lh` units
 * ties it to the code block's own line height rather than to the hard-coded
 * pixel height it used to be. That number was `1132px`, which was this many
 * lines at the current font size and silently stopped being that the moment
 * either changed.
 */
const COLLAPSE_AFTER_LINES = 50;

const CustomCode: React.FC<CustomCodeProps> = ({
  children,
  className,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const nodes = Children.toArray(children);

  // rehype-pretty-code emits one `<span data-line>` per line separated by
  // literal newline text nodes, so the children run 2n-1 for n lines.
  const lineCount = Math.ceil(nodes.length / 2);
  const isCollapsible = lineCount > COLLAPSE_AFTER_LINES;

  return (
    <>
      <code
        className={cn(
          GeistMono.className,
          'relative text-[13px]',
          {
            'max-h-[calc(50*1lh)] overflow-y-hidden':
              isCollapsible && !expanded,
            'max-h-full overflow-y-auto': expanded,
          },
          className,
        )}
        {...props}
      >
        {nodes}
      </code>

      {isCollapsible && (
        <>
          <button
            aria-label="Toggle expand/collapse code"
            onClick={() => setExpanded((prev) => !prev)}
            className={cn(
              'mt-2 flex items-center rounded-md px-2.5 py-1 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700',
              GeistSans.className,
            )}
          >
            {expanded ? (
              <>
                <GoChevronUp className="mr-1" size={20} />
                Collapse ({lineCount} lines)
              </>
            ) : (
              <>
                <GoChevronDown className="mr-1" size={20} />
                Expand ({lineCount} lines)
              </>
            )}
          </button>
        </>
      )}
    </>
  );
};

export default CustomCode;
