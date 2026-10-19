'use client';

import { ViewTransition } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Cross-fade from one page to the next, and animate nothing else.
 *
 * Keyed by the path, a new page is an exit and an enter: the old page fades
 * out where it was and the new one fades in where it is. Unkeyed, it was an
 * update, which also morphs the box from the old page's size and position to
 * the new one's, so leaving a page far down slid the new one in from below.
 *
 * Anything else, such as `InPageLink` pushing a hash, is an update, and
 * `default="none"` keeps it still instead of cross-fading the whole page.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter="auto" exit="auto" default="none">
      {children}
    </ViewTransition>
  );
}
