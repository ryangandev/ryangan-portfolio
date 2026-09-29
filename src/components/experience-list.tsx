import { format, parseISO } from 'date-fns';
import Image from 'next/image';

import { Experience } from '@/data/experience';

const formatMonth = (value: string) => format(parseISO(value), 'MMM yyyy');

const formatRange = ({ start, end }: Experience) =>
  `${formatMonth(start)} - ${end ? formatMonth(end) : 'Present'}`;

/**
 * The logo, cropped to a circle. Logos carry their own brand-colored tile, so
 * a faint outline gives the dark ones an edge against the dark theme.
 */
const ExperienceMark = ({ mark }: Pick<Experience, 'mark'>) => {
  if (typeof mark !== 'function') {
    return (
      <Image
        src={mark}
        alt=""
        width={28}
        height={28}
        className="mt-0.5 size-7 shrink-0 rounded-full outline-1 -outline-offset-1 outline-black/5 dark:outline-white/10"
      />
    );
  }

  const Icon = mark;

  return (
    <span
      className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-neutral-400 dark:text-neutral-300"
      aria-hidden
    >
      <Icon size={14} />
    </span>
  );
};

type ExperienceListProps = {
  items: Experience[];
};

const ExperienceList = ({ items }: ExperienceListProps) => {
  return (
    <ol className="mb-7 space-y-7">
      {items.map((item) => (
        <li key={`${item.organization}-${item.start}`} className="flex gap-4">
          <ExperienceMark mark={item.mark} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-base">{item.role}</h3>
              <span className="text-sm whitespace-nowrap color-level-5">
                {formatRange(item)}
              </span>
            </div>
            <p className="mb-2 text-sm color-level-4">
              {item.organization}, {item.location}
            </p>
            <p className="mb-0 text-[15px]">{item.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default ExperienceList;
