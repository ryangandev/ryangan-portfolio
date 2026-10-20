import React from 'react';
import { format } from 'date-fns';

import AnimatedLink from '@/components/animated-link';
import TechStackIcon from '@/components/icons/tech-stack-icon';
import { platformLabels } from '@/data/platforms';
import { techStack } from '@/data/tech-stack';
import { parseContentDate } from '@/lib/date';
import { displayUrlParts } from '@/lib/display-url';
import { cn } from '@/lib/utils';
import type { ProjectFrontmatter } from '@/schemas/content-schema';
import type { PortfolioLayout } from '@/schemas/portfolio-layout-schema';

type ProjectFactsProps = {
  project: ProjectFrontmatter;
  stack: PortfolioLayout['stack'];
  /**
   * `gutter` stacks every fact under its label, for the right-hand gutter
   * from xl up; `inline` runs them into two lines under the title.
   */
  placement: 'gutter' | 'inline';
};

const badgeClassName =
  'rounded-full border px-2.5 text-[13px] leading-[22px] color-level-4';

const Stack = ({
  techStack: names,
  stack,
  placement,
}: {
  techStack: ProjectFrontmatter['techStack'];
  stack: PortfolioLayout['stack'];
  placement: ProjectFactsProps['placement'];
}) => (
  <ul
    aria-label="Tech stack"
    className={cn(
      'flex',
      stack === 'icons' && placement === 'gutter'
        ? 'flex-col gap-1.5'
        : 'flex-wrap',
      stack === 'icons' && placement === 'inline' && 'gap-x-4 gap-y-1',
      stack === 'badges' && 'gap-1.5',
    )}
  >
    {names.map((name) => (
      <li
        key={name}
        className={cn(
          stack === 'icons'
            ? 'flex items-center gap-2 color-level-2'
            : badgeClassName,
        )}
      >
        {stack === 'icons' && (
          <TechStackIcon name={name} size={16} className="shrink-0" />
        )}
        {techStack[name].label}
      </li>
    ))}
  </ul>
);

const DotLine = ({ facts }: { facts: React.ReactNode[] }) => (
  <p className="mb-0 flex flex-wrap items-center gap-x-1.5 color-level-2">
    {facts.map((fact, index) => (
      <React.Fragment key={index}>
        {index > 0 && (
          <span aria-hidden className="color-level-5">
            ·
          </span>
        )}
        {typeof fact === 'string' ? <span>{fact}</span> : fact}
      </React.Fragment>
    ))}
  </p>
);

/**
 * A project's role, year, platforms, links, and tech stack. The project page
 * shows them in the right-hand gutter from xl up and under the title below
 * that; the admin preview, which has no gutter, always under the title.
 */
const ProjectFacts = ({ project, stack, placement }: ProjectFactsProps) => {
  const year = format(parseContentDate(project.date), 'yyyy');
  const platforms = platformLabels(project.platforms).join(', ');
  const links = [
    project.link?.live && { label: 'Live', href: project.link.live },
    project.link?.github && {
      label: 'Repository',
      href: project.link.github,
    },
  ].filter((link) => !!link);

  if (placement === 'inline') {
    // The links get a line of their own, so a narrow screen never wraps one
    // away from its separator.
    return (
      <div className="flex flex-col gap-3 text-sm leading-[22px]">
        <div className="flex flex-col gap-1">
          <DotLine facts={[project.role, year, platforms]} />
          {links.length > 0 && (
            <DotLine
              facts={links.map(({ label, href }) => (
                <AnimatedLink key={href} href={href} isExternal>
                  {label === 'Live' ? 'Live demo' : label}
                </AnimatedLink>
              ))}
            />
          )}
        </div>
        <Stack techStack={project.techStack} stack={stack} placement="inline" />
      </div>
    );
  }

  const facts: { label: string; value: React.ReactNode }[] = [
    { label: 'Role', value: project.role },
    { label: 'Year', value: year },
    { label: 'Platforms', value: platforms },
    ...links.map(({ label, href }) => ({
      label,
      value: (
        // Each piece stays whole, so an address too long for the 224px
        // gutter wraps after a slash, never at a hyphen.
        <AnimatedLink href={href} isExternal>
          {displayUrlParts(href).map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <wbr />}
              <span className="whitespace-nowrap">{part}</span>
            </React.Fragment>
          ))}
        </AnimatedLink>
      ),
    })),
    {
      label: 'Stack',
      value: (
        <Stack techStack={project.techStack} stack={stack} placement="gutter" />
      ),
    },
  ];

  return (
    <dl className="mb-0 space-y-3.5 text-sm leading-[22px]">
      {facts.map(({ label, value }) => (
        <div key={label}>
          <dt className="color-level-5">{label}</dt>
          <dd className={cn('color-level-2', label === 'Stack' && 'mt-1.5')}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ProjectFacts;
