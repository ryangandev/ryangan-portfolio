import Link from 'next/link';
import { LuArrowRight } from 'react-icons/lu';

import { cn } from '@/lib/utils';

export type LinkRow = {
  href: string;
  title: string;
  /** Shown beside the title from md up */
  summary?: string;
  /** The year or path at the end of the row */
  end: string;
};

type LinkRowsProps = {
  rows: LinkRow[];
  /** A last row leading to the rest, such as every post */
  more?: { href: string; label: string };
};

/**
 * `text` with the rule after it. The rule is as wide as the row but takes up
 * only its shortest length in the line, and the row clips the rest where the
 * end starts. Its padding is the gap after the word. It holds on to the last
 * word, so a line too full for both carries them to the next line together
 * rather than leaving a stub of rule.
 */
const WithRule = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const lastWord = text.lastIndexOf(' ') + 1;

  return (
    <>
      {text.slice(0, lastWord)}
      <span className="whitespace-nowrap">
        {text.slice(lastWord)}
        <span
          aria-hidden
          data-rule
          className={cn(
            '-mr-[calc(100%-1.625rem)] inline-block h-px w-full bg-border/80 bg-clip-content pl-2.5 align-middle',
            className,
          )}
        />
      </span>
    </>
  );
};

/**
 * A list of pages, one row each: the title, a rule, and a year or path at the
 * end. Hovering a row fades the others.
 *
 * The rule follows the title's last line rather than its first, and the end
 * sits level with that line, so a title that wraps on a phone still reads as
 * one row instead of leaving a stub of rule beside its first line.
 *
 * The rows' own padding is taken back from the list's outer edge, so the
 * first and last titles sit as far from the content around them as a
 * paragraph's text would.
 */
const LinkRows = ({ rows, more }: LinkRowsProps) => (
  <ul className="group -my-2 text-[15px]">
    {rows.map((row) => (
      <li
        key={row.href}
        className="py-2 transition-opacity group-hover:opacity-60 hover:!opacity-100"
      >
        <Link href={row.href} className="flex items-end gap-x-2.5">
          <span className="min-w-0 flex-1 overflow-hidden text-pretty">
            {/* The rule follows the summary where it shows, from md up. */}
            <span className="font-medium color-level-2">
              <WithRule
                text={row.title}
                className={cn(row.summary && 'md:hidden')}
              />
            </span>
            {row.summary && (
              <span className="ml-2.5 hidden color-level-4 md:inline">
                <WithRule text={row.summary} />
              </span>
            )}
          </span>
          <span className="shrink-0 color-level-5">{row.end}</span>
        </Link>
      </li>
    ))}
    {more && (
      <li className="py-2 transition-opacity group-hover:opacity-60 hover:!opacity-100">
        <Link
          href={more.href}
          className="group/more inline-flex items-center gap-1.5 color-level-4 transition-colors hover:color-level-2"
        >
          {more.label}
          <LuArrowRight
            aria-hidden
            size={14}
            className="transition-transform group-hover/more:translate-x-0.5"
          />
        </Link>
      </li>
    )}
  </ul>
);

export default LinkRows;
