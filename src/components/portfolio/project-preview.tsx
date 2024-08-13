import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import TechStackIcon from '@/components/tech-stack-icon';
import { cn } from '@/lib/utils';
import { TechStackIconName } from '@/models/data';
import { ProjectMetadata } from '@/models/project';

type ProjectPreviewProps = {
  project: ProjectMetadata;
};

const ProjectPreview: React.FC<ProjectPreviewProps> = ({ project }) => {
  return (
    <div className="flex flex-col">
      <Link
        href={'/portfolio/' + project.slug}
        className={cn('rounded-lg border border-border/80')}
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
      <h3 className="mt-3">{project.title}</h3>
      <div className="mb-3 mt-2 flex flex-shrink space-x-2.5">
        {project.techStack.map((tech) => (
          <TechStackIcon
            key={tech}
            name={tech as TechStackIconName}
            size={16}
          />
        ))}
      </div>
      <p>{project.summary}</p>
    </div>
  );
};

export default ProjectPreview;
