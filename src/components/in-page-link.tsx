'use client';

import { isPlainClick } from '@/lib/utils';

type InPageLinkProps = React.ComponentPropsWithoutRef<'a'> & {
  /** A `#` and the id of the element to go to */
  href: string;
};

/**
 * A link to another part of the same page, such as a table of contents entry
 * or a footnote. It scrolls there smoothly, unless the reader has asked for
 * less motion, when the browser jumps there as usual.
 *
 * The page itself does not scroll smoothly (no `scroll-smooth` on `<html>`):
 * that would also animate the browser putting the reader back where they were
 * on Back and Forward, from the top. So the smooth scroll is this link's own,
 * done as Next does for a hash link: a history entry for the section, the
 * scroll, then focus, so the next Tab starts from the section.
 */
export default function InPageLink({
  href,
  onClick,
  ...props
}: InPageLinkProps) {
  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    const { hash } = new URL(href, window.location.href);
    const section = document.getElementById(decodeURIComponent(hash.slice(1)));
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (
      event.defaultPrevented ||
      !isPlainClick(event) ||
      !section ||
      reduceMotion
    ) {
      return;
    }

    event.preventDefault();

    // Clicking the section already in the address bar scrolls to it again,
    // without a second history entry, as a plain link does.
    if (window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }

    section.scrollIntoView({ behavior: 'smooth' });

    // A heading cannot take focus on its own. `globals.css` hides the ring on
    // anything given a tabindex of -1.
    if (!section.hasAttribute('tabindex') && section.tabIndex < 0) {
      section.tabIndex = -1;
    }

    section.focus({ preventScroll: true });
  };

  return <a {...props} href={href} onClick={scrollToSection} />;
}
