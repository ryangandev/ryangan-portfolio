import React from 'react';
import { LinkProps } from 'next/link';
import { Link } from 'next-view-transitions';
import { LuArrowUpRight } from 'react-icons/lu';

import { cn } from '@/lib/utils';

type AnimatedLinkProps = Omit<LinkProps, 'href'> & {
  href: string;
  children: React.ReactNode;
  /**
   * Opens in a new tab, marked with an arrow. Use it for anything that is not
   * a page of this site, including same-origin files like the resume PDF.
   */
  isExternal?: boolean;
  className?: string;
  iconClassName?: string;
};

export default function AnimatedLink({
  children,
  isExternal = false,
  className,
  iconClassName,
  href,
  ...props
}: AnimatedLinkProps) {
  const linkClassName = cn(
    'group inline-block font-medium color-level-2 underline decoration-gray-400 underline-offset-4 transition-colors hover:decoration-gray-700 dark:decoration-gray-600 dark:hover:decoration-gray-300',
    className,
  );

  if (isExternal) {
    // A plain anchor, not <Link>. Link prefetches any same-origin href once it
    // scrolls into view, whatever `target` says, so the resume link was
    // downloading the whole 121 KB PDF for every visitor who scrolled past it.
    // A new-tab link gets nothing from client-side routing in return.
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
        <LuArrowUpRight
          className={cn(
            '-mr-0.5 inline-block text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gray-700 dark:text-gray-600 dark:group-hover:text-gray-300',
            iconClassName,
          )}
          size={16}
        />
      </a>
    );
  }

  return (
    <Link {...props} href={href} className={linkClassName}>
      {children}
    </Link>
  );
}
