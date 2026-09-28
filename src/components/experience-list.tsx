import { format, parseISO } from 'date-fns';

import { Experience } from '@/data/experience';

const formatMonth = (value: string) => format(parseISO(value), 'MMM yyyy');

const formatRange = ({ start, end }: Experience) =>
  `${formatMonth(start)} - ${end ? formatMonth(end) : 'Present'}`;

type ExperienceListProps = {
  items: Experience[];
};

const ExperienceList = ({ items }: ExperienceListProps) => {
  return (
    <ol className="mb-7 space-y-7">
      {items.map((item) => (
        <li key={`${item.organization}-${item.start}`} className="flex gap-4">
          <span
            className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border color-level-4"
            aria-hidden
          >
            <item.icon size={14} />
          </span>
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
