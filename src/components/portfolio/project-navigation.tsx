import { Link } from 'next-view-transitions';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';

import FadeInImage from '@/components/fade-in-image';
import { getImagePlaceholder } from '@/lib/image-placeholder';
import { cn } from '@/lib/utils';
import { ProjectMetadata } from '@/models/project';

type ProjectNavigationProps = {
  previous: ProjectMetadata | null;
  next: ProjectMetadata | null;
};

/**
 * The projects either side of this one in the portfolio list, each with its
 * thumbnail. Previous is the one above it in the list, so the newer one.
 */
const ProjectNavigation = async ({
  previous,
  next,
}: ProjectNavigationProps) => {
  if (!previous && !next) {
    return null;
  }

  return (
    <nav aria-label="More projects" className="grid gap-4 sm:grid-cols-2">
      {previous && (
        <ProjectLink
          project={previous}
          direction="previous"
          className="sm:col-start-1"
        />
      )}
      {next && (
        <ProjectLink
          project={next}
          direction="next"
          className="sm:col-start-2"
        />
      )}
    </nav>
  );
};

type ProjectLinkProps = {
  project: ProjectMetadata;
  direction: 'previous' | 'next';
  className?: string;
};

const ProjectLink = async ({
  project,
  direction,
  className,
}: ProjectLinkProps) => {
  const isNext = direction === 'next';

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      rel={isNext ? 'next' : 'prev'}
      className={cn(
        'group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900',
        isNext && 'sm:flex-row-reverse sm:text-right',
        className,
      )}
    >
      <FadeInImage
        src={project.thumbnailUrl}
        placeholderSrc={await getImagePlaceholder(project.thumbnailUrl)}
        alt=""
        width={72}
        height={44}
        sizes="72px"
        wrapperClassName="h-11 w-18 shrink-0 overflow-hidden rounded-sm"
        className="h-full w-full object-cover"
        quality={95}
      />
      <span className="flex min-w-0 flex-col">
        <span
          className={cn(
            'flex items-center gap-1.5 text-sm color-level-5',
            isNext && 'sm:justify-end',
          )}
        >
          {!isNext && (
            <GoArrowLeft className="transition-transform group-hover:-translate-x-0.5" />
          )}
          {isNext ? 'Next' : 'Previous'}
          {isNext && (
            <GoArrowRight className="transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
        <span className="font-medium color-level-1">{project.title}</span>
      </span>
    </Link>
  );
};

export default ProjectNavigation;
