import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import HighlightedText from '@/components/highlighted-text';
import TechStackIcon from '@/components/tech-stack-icon';
import { cn } from '@/lib/utils';
import { TechStackIconName } from '@/models/data';
import { ProjectMetadata } from '@/models/project';

type ProjectPreviewProps = {
  project: ProjectMetadata;
  searchTerm?: string;
};

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  project,
  searchTerm = '',
}) => {
  return (
    <div className="group flex flex-col">
      <Link
        href={'/portfolio/' + project.slug}
        className={cn(
          'overflow-hidden rounded-lg border border-border/80',
          'transition-transform hover:scale-[1.025]',
        )}
      >
        <figure className="relative h-48 object-cover">
          <Image
            src={project.thumbnailUrl}
            alt={project.title}
            quality={95}
            className="rounded-lg"
            sizes="(max-width: 768px) 100%"
            fill
          />
        </figure>
      </Link>
      <h4 className="mt-3">
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
      </h4>
      <div className="mt-2 flex space-x-2.5">
        {project.techStack.map((tech) => (
          <TechStackIcon
            key={tech}
            name={tech as TechStackIconName}
            size={16}
            className="flex flex-shrink-0"
          />
        ))}
      </div>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        <HighlightedText
          text={project.summary}
          highlightedString={searchTerm}
        />
      </p>
    </div>
  );
};

export default ProjectPreview;
