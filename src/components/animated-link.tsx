import React from 'react';
import { LinkProps } from 'next/link';
import { Link } from 'next-view-transitions';
import { LuArrowUpRight } from 'react-icons/lu';

import { cn } from '@/lib/utils';

/**
 * The site's one link style, shared with links written in MDX
 * (`mdx/custom-link.tsx`), which flow inline within prose and so leave out
 * `inline-block`.
 */
export const linkClassName =
  'group font-medium color-level-2 underline decoration-neutral-400 underline-offset-4 transition-colors hover:decoration-neutral-700 dark:decoration-neutral-600 dark:hover:decoration-neutral-300';

/** The up-right arrow that marks a link opening in a new tab */
export const linkArrowClassName =
  '-mr-0.5 inline-block text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-neutral-700 dark:text-neutral-600 dark:group-hover:text-neutral-300';

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
  const anchorClassName = cn('inline-block', linkClassName, className);

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
        className={anchorClassName}
      >
        {children}
        <LuArrowUpRight
          className={cn(linkArrowClassName, iconClassName)}
          size={16}
        />
      </a>
    );
  }

  return (
    <Link {...props} href={href} className={anchorClassName}>
      {children}
    </Link>
  );
}
