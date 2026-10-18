'use client';

import { useState } from 'react';
import { Link } from 'next-view-transitions';

import FadeInImage from '@/components/fade-in-image';
import { PlatformName, platformLabels, platformNames } from '@/data/platforms';
import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { ProjectMetadata } from '@/models/project';
import type { PortfolioLayout } from '@/schemas/portfolio-layout-schema';

type ProjectIndexProps = {
  /** Newest first */
  projects: ProjectMetadata[];
  /** Each thumbnail's `getImagePlaceholder`, by project slug */
  thumbnailPlaceholders: Record<string, string | undefined>;
  layout: PortfolioLayout['list'];
};

type Filter = PlatformName | 'all';

/**
 * The portfolio list: projects grouped under their year, as the blog archive
 * groups posts, with filters for the platforms the projects run on.
 *
 * `thumbnails` gives every row a small thumbnail. `timeline` keeps the rows to
 * text and, from xl up, shows the hovered row's thumbnail in the right-hand
 * gutter, the first row's while nothing is hovered. The thumbnail stays in one
 * place, level with the top of the list, and cross-fades between projects:
 * hung from each row instead, it jumped as the pointer moved down the list,
 * and from the last rows it ran past the list onto the footer.
 */
const ProjectIndex = ({
  projects,
  thumbnailPlaceholders,
  layout,
}: ProjectIndexProps) => {
  const [filter, setFilter] = useState<Filter>('all');
  const [hovered, setHovered] = useState<string | null>(null);
  const shown =
    filter === 'all'
      ? projects
      : projects.filter((project) => project.platforms.includes(filter));
  const years = [
    ...new Set(
      shown.map((project) => parseContentDate(project.date).getFullYear()),
    ),
  ];
  // Only platforms some project runs on get a filter.
  const filters: { value: Filter; label: string; count: number }[] = [
    { value: 'all', label: 'All', count: projects.length },
    ...platformNames.flatMap((name) => {
      const count = projects.filter((project) =>
        project.platforms.includes(name),
      ).length;

      return count > 0
        ? [{ value: name, label: platformLabels([name])[0], count }]
        : [];
    }),
  ];

  // A filter can hide the hovered project, so fall back to the first shown.
  const previewed =
    shown.find((project) => project.slug === hovered) ?? shown[0];

  const yearColumn =
    layout === 'thumbnails' ? 'w-14 md:w-24' : 'w-[70px] md:w-40';

  return (
    <section>
      <div
        role="group"
        aria-label="Filter by platform"
        className="mb-6 flex flex-wrap gap-2"
      >
        {filters.map(({ value, label, count }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            // The topic pills' style, with the pressed one held in its hover
            // state.
            className={cn(
              'rounded-full border px-3 py-0.5 text-sm transition-colors',
              filter === value
                ? 'border-neutral-300 bg-neutral-100 text-neutral-900 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100'
                : 'color-level-4 hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-neutral-100',
            )}
          >
            {label} <span className="color-level-5">{count}</span>
          </button>
        ))}
      </div>

      <div
        className="group/list relative"
        onMouseLeave={() => setHovered(null)}
      >
        {layout === 'timeline' && (
          // The gutter only exists from xl up. Decorative: the row already
          // names the project. Sticky, so it stays in view down a long list.
          <div className="pointer-events-none absolute inset-y-0 left-full ml-10 hidden xl:block">
            {/* Level with the first row's title */}
            <div className="sticky top-32 mt-[15px] h-[146px] w-60 overflow-hidden rounded-lg border border-border/80">
              {shown.map((project) => (
                <FadeInImage
                  key={project.slug}
                  src={project.thumbnailUrl}
                  placeholderSrc={thumbnailPlaceholders[project.slug]}
                  alt=""
                  width={240}
                  height={146}
                  sizes="240px"
                  loading="lazy"
                  wrapperClassName={cn(
                    'absolute inset-0 transition-opacity',
                    project === previewed ? 'opacity-100' : 'opacity-0',
                  )}
                  className="h-full w-full object-cover"
                  quality={95}
                />
              ))}
            </div>
          </div>
        )}

        {years.map((year) => (
          <ul key={year} className="group/section border-t">
            {shown
              .filter(
                (project) =>
                  parseContentDate(project.date).getFullYear() === year,
              )
              .map((project, index) => {
                return (
                  <li
                    key={project.slug}
                    onMouseEnter={() => setHovered(project.slug)}
                    className={cn(
                      'group/item relative transition-opacity',
                      'group-hover/list:opacity-50 hover:!opacity-100',
                    )}
                  >
                    <Link
                      href={`/portfolio/${project.slug}`}
                      className={cn(
                        'flex items-center',
                        layout === 'thumbnails' ? 'py-3.5' : 'py-3',
                      )}
                    >
                      <span
                        className={cn(
                          'shrink-0 self-start color-level-5 transition-colors',
                          'group-hover/section:text-neutral-900 dark:group-hover/section:text-neutral-100',
                          yearColumn,
                        )}
                      >
                        {index === 0 ? year : null}
                      </span>
                      <span
                        className={cn(
                          'relative flex min-w-0 flex-1 items-center gap-4',
                          // The rule between rows starts after the year, as
                          // in the blog archive.
                          // Any before: utility makes the pseudo-element, so
                          // the first row gets none of them.
                          index !== 0 && [
                            "before:absolute before:inset-x-0 before:h-px before:bg-border before:content-['']",
                            layout === 'thumbnails'
                              ? 'before:-top-3.5'
                              : 'before:-top-3',
                          ],
                        )}
                      >
                        {layout === 'thumbnails' && (
                          <FadeInImage
                            src={project.thumbnailUrl}
                            placeholderSrc={thumbnailPlaceholders[project.slug]}
                            alt=""
                            width={104}
                            height={64}
                            sizes="104px"
                            wrapperClassName="h-16 w-26 shrink-0 overflow-hidden rounded-md border border-border/80"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                            quality={95}
                          />
                        )}
                        <span className="flex min-w-0 flex-1 flex-col">
                          <span className="color-level-1">{project.title}</span>
                          <span className="text-sm leading-[22px] color-level-4">
                            {project.summary}
                          </span>
                        </span>
                        <span
                          className={cn(
                            'shrink-0 text-sm whitespace-nowrap color-level-5',
                            layout === 'thumbnails' && 'hidden sm:block',
                          )}
                        >
                          {platformLabels(project.platforms).join(', ')}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
          </ul>
        ))}
      </div>
    </section>
  );
};

export default ProjectIndex;
