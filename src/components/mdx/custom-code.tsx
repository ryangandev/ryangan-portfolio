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

const CustomCode: React.FC<CustomCodeProps> = ({
  children,
  className,
  ...props
}) => {
  const [expanded, setExpanded] = useState(false);
  const lines = Children.toArray(children);
  const maxLines = 100; // Max lines is 50, divided by 2 to remove '\n'

  return (
    <>
      <code
        className={cn(
          GeistMono.className,
          'relative text-[13px]',
          {
            'max-h-[1132px] overflow-y-hidden': !expanded,
            'max-h-full overflow-y-auto': expanded,
          },
          className,
        )}
        {...props}
      >
        {lines}
      </code>

      {lines.length > maxLines && (
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
                Collapse ({Math.ceil(lines.length / 2)} lines)
              </>
            ) : (
              <>
                <GoChevronDown className="mr-1" size={20} />
                Expand ({Math.ceil(lines.length / 2)} lines)
              </>
            )}
          </button>
        </>
      )}
    </>
  );
};

export default CustomCode;
