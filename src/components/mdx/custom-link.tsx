import React from 'react';
import Link from 'next/link';
import { LuArrowUpRight } from 'react-icons/lu';

import { linkArrowClassName, linkClassName } from '@/components/animated-link';
import InPageLink from '@/components/in-page-link';
import { siteUrl } from '@/data/site';

type CustomLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  href: string;
};

/**
 * The path of the page of this site that `href` points at, written root
 * relative (`/portfolio/penny-diary`) or in full (`https://ryangan.me/blog`),
 * or null for anything else: another site, a relative or `mailto:` href, or a
 * file of this site such as the resume PDF or the feed, which has an extension
 * where a page has none.
 */
export function sitePagePath(href: string): string | null {
  const isRootRelative = href.startsWith('/') && !href.startsWith('//');
  const isAbsolute = /^[a-z][a-z\d+.-]*:/i.test(href);
  if (!isRootRelative && !isAbsolute) return null;

  const url = URL.parse(href, siteUrl);
  if (!url || url.origin !== siteUrl) return null;
  if (/\.[^/]*$/.test(url.pathname)) return null;

  return `${url.pathname}${url.search}${url.hash}`;
}

const CustomLink: React.FC<CustomLinkProps> = ({
  href,
  children,
  ...props
}) => {
  // A heading's own link, a footnote, or its way back to the text
  if (href.startsWith('#')) {
    return (
      <InPageLink {...props} href={href}>
        {children}
      </InPageLink>
    );
  }

  // Another page of this site opens in place, as AnimatedLink does
  const pagePath = sitePagePath(href);
  if (pagePath) {
    return (
      <Link {...props} href={pagePath} className={linkClassName}>
        {children}
      </Link>
    );
  }

  // A plain anchor, as AnimatedLink renders with isExternal: next/link would
  // prefetch a same-origin file, such as the resume PDF, once it is in view.
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClassName}
    >
      {children}
      <LuArrowUpRight className={linkArrowClassName} size={16} />
    </a>
  );
};

export default CustomLink;
