import React from 'react';
import { LinkProps } from 'next/link';
import { Link } from 'next-view-transitions';
import { LuArrowUpRight } from 'react-icons/lu';

import { cn } from '@/lib/utils';

type AnimatedLinkProps = LinkProps & {
  children: React.ReactNode;
  isExternal?: boolean;
  className?: string;
  iconClassName?: string;
};

export default function AnimatedLink({
  children,
  isExternal = false,
  className,
  iconClassName,
  ...props
}: AnimatedLinkProps) {
  return (
    <Link
      {...props}
      target={isExternal ? '_blank' : '_self'}
      className={cn(
        'color-level-2 group inline-block font-medium underline decoration-gray-400 underline-offset-4 transition-colors hover:decoration-gray-700 dark:decoration-gray-600 dark:hover:decoration-gray-300',
        // 'group no-underline',
        className,
      )}
    >
      {/* <span
        className={cn(
          'relative transition-colors after:absolute after:-bottom-[2px] after:left-0 after:right-0 after:h-px after:bg-gray-400 after:content-[""] after:group-hover:bg-gray-700 dark:after:bg-gray-600 dark:after:group-hover:bg-gray-300',
        )}
      > */}
      {children}
      {/* </span> */}
      {isExternal && (
        <LuArrowUpRight
          className={cn(
            'inline-block text-gray-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gray-700 dark:text-gray-600 dark:group-hover:text-gray-300',
            iconClassName,
          )}
          size={16}
        />
      )}
    </Link>
  );
}
