'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Starts every page a link opens at the top.
 *
 * Next scrolls to the top only when it cannot see the new page's top. The
 * layout puts space above every page, so a page that scrolls by less than that
 * space, reached from far down another page, kept the scroll the browser
 * clamped it to: the reader landed a little way down.
 *
 * Back and Forward are left to the browser, which puts the reader back where
 * they were. Next renders those in a transition after `popstate`, so the
 * listener here has always marked them by then.
 */
export default function NewPageAtTop() {
  const pathname = usePathname();
  const shownPathname = useRef(pathname);
  const traversedTo = useRef<string | null>(null);

  useEffect(() => {
    const onPopState = () => {
      traversedTo.current = window.location.pathname;
    };

    window.addEventListener('popstate', onPopState);

    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // A layout effect, so the page is never painted where it was left
  useLayoutEffect(() => {
    if (pathname === shownPathname.current) return;

    shownPathname.current = pathname;

    // A Back within one page, between its sections, also fires popstate, so
    // match the path rather than keep a flag that would outlive it.
    const isTraversal = traversedTo.current === pathname;

    traversedTo.current = null;

    // Next itself scrolls to the target of a link with a hash
    if (isTraversal || window.location.hash) return;

    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
