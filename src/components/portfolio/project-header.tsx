import React from 'react';

import FadeInImage from '@/components/fade-in-image';
import ProjectFacts from '@/components/portfolio/project-facts';
import { contentImageSizes } from '@/data/site';
import { getImagePlaceholder } from '@/lib/image-placeholder';
import { cn } from '@/lib/utils';
import type { ProjectFrontmatter } from '@/schemas/content-schema';
import type { PortfolioLayout } from '@/schemas/portfolio-layout-schema';

type ProjectHeaderProps = {
  project: ProjectFrontmatter;
  stack: PortfolioLayout['stack'];
  /**
   * The page shows the facts in the right-hand gutter from xl up, so here
   * they stop at xl. The admin preview has no gutter and keeps them.
   */
  factsInGutter: boolean;
  /**
   * Replaces the thumbnail, for the admin preview while the URL is not one
   * next/image accepts
   */
  thumbnailFallback?: React.ReactNode;
};

/**
 * The top of a project page: title, summary, the facts below xl, and the
 * thumbnail. Shared by the project page and the admin editor's preview.
 */
const ProjectHeader = async ({
  project,
  stack,
  factsInGutter,
  thumbnailFallback,
}: ProjectHeaderProps) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="mb-0 text-3xl font-bold md:text-4xl">{project.title}</h1>
        <p className="mb-0 text-lg color-level-4">{project.summary}</p>
      </div>

      <div className={cn(factsInGutter && 'xl:hidden')}>
        <ProjectFacts project={project} stack={stack} placement="inline" />
      </div>

      {thumbnailFallback ?? (
        <FadeInImage
          src={project.thumbnailUrl}
          placeholderSrc={await getImagePlaceholder(project.thumbnailUrl)}
          alt={project.title}
          // Every thumbnail is 1536 by 936, so the box is held at that shape
          // before it loads. Another shape still shows at its own once loaded.
          width={1536}
          height={936}
          sizes={contentImageSizes}
          wrapperClassName="w-full rounded-lg"
          className="h-auto w-full rounded-lg border border-border/80 shadow-md"
          quality={95}
          priority
        />
      )}
    </>
  );
};

export default ProjectHeader;
