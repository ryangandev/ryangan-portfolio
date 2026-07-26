import React from 'react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';

import HighlightedText from '@/components/highlighted-text';
import TechStackIcon from '@/components/icons/tech-stack-icon';
import { cn } from '@/lib/utils';
import { TechStackIconName } from '@/models/data';
import { ProjectMetadata } from '@/models/project';

type ProjectPreviewProps = {
  project: ProjectMetadata;
  searchTerm?: string;
  /** Position in the grid, used to decide whether the thumbnail is eager */
  index?: number;
};

/**
 * The grid is two columns, so only the first two cards can be above the fold on
 * any realistic viewport. Marking every thumbnail `priority` — which is what
 * this did — opts all of them out of lazy loading and emits a high-priority
 * preload each, so the images nobody has scrolled to yet compete with the one
 * that decides LCP.
 */
const EAGER_CARDS = 2;

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  searchTerm = '',
  index = 0,
}) => {
  const isAboveFold = index < EAGER_CARDS;

  return (
    <div className="group flex flex-col">
      <Link
        href={'/portfolio/' + project.slug}
        className={cn(
          'overflow-hidden rounded-lg border border-border/80',
          'transition-transform hover:scale-[1.025]',
        )}
      >
        <figure className="relative h-[189.1px]">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            fill
            sizes="(max-width: 644px) 100%"
            className="rounded-lg object-cover"
            quality={95}
            priority={isAboveFold}
            loading={isAboveFold ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="/blur.svg"
          />
        </figure>
      </Link>
      <h3 className="mt-1 color-level-1">
        <Link
          href={'/portfolio/' + project.slug}
          className={cn(
            'bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-500 dark:to-teal-500',
            'bg-[length:0px_4px] bg-left-bottom bg-no-repeat',
            'transition-[background-size] duration-500',
            'group-hover:bg-[length:100%_4px]',
          )}
        >
          <HighlightedText
            text={project.title}
            highlightedString={searchTerm}
          />
        </Link>
      </h3>
      <div className="mt-2 flex flex-wrap gap-2.5">
        {project.techStack.map((tech) => (
          <TechStackIcon
            key={tech}
            name={tech as TechStackIconName}
            size={16}
            className="flex shrink-0"
          />
        ))}
      </div>
      <p className="mt-3 mb-0 color-level-4">
        <HighlightedText
          text={project.summary}
          highlightedString={searchTerm}
        />
      </p>
    </div>
  );
};

export default ProjectPreview;
