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
        'group inline-block font-medium color-level-2 underline decoration-gray-400 underline-offset-4 transition-colors hover:decoration-gray-700 dark:decoration-gray-600 dark:hover:decoration-gray-300',
        className,
      )}
    >
      {children}
      {isExternal && (
        <LuArrowUpRight
          className={cn(
            'inline-block text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gray-700 dark:text-gray-600 dark:group-hover:text-gray-300',
            iconClassName,
          )}
          size={16}
        />
      )}
    </Link>
  );
}
