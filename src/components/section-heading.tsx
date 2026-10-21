import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

type SectionHeadingProps = {
  children: React.ReactNode;
  /** A link to the rest of the section, such as every post, across from it */
  more: { href: string; label: string };
};

/**
 * A section's heading with a link to the rest of it at the other end, level
 * with the heading's text.
 *
 * The heading keeps its own margins: inside a flex row they no longer collapse
 * into the content around it, but nothing next to it has margins of its own,
 * so the section sits where a bare heading would.
 */
const SectionHeading = ({ children, more }: SectionHeadingProps) => (
  <div className="flex items-baseline justify-between gap-x-4">
    <h2>{children}</h2>
    <Link
      href={more.href}
      className="group inline-flex shrink-0 items-center gap-1.5 text-[15px] color-level-4 transition-colors hover:color-level-2"
    >
      {more.label}
      <LuArrowRight
        aria-hidden
        size={14}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  </div>
);

export default SectionHeading;
