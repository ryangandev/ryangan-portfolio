import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import Byline from '@/components/byline';
import Callout from '@/components/callout';
import SocialIcon from '@/components/icons/social-icon';
import TechStackIcon from '@/components/icons/tech-stack-icon';
import { contentImageSizes } from '@/data/site';
import { techStack } from '@/data/tech-stack';
import { parseContentDate } from '@/lib/date';
import type { ProjectFrontmatter } from '@/schemas/content-schema';

type ProjectHeaderProps = {
  project: ProjectFrontmatter;
  /**
   * Replaces the thumbnail, for the admin preview while the URL is not one
   * next/image accepts
   */
  thumbnailFallback?: React.ReactNode;
};

/**
 * The top of a project page: title, byline and links, tech stack, summary,
 * and thumbnail. Shared by the project page and the admin editor's preview.
 */
const ProjectHeader = ({ project, thumbnailFallback }: ProjectHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>

      <section className="space-y-3 md:flex md:items-center md:justify-between md:space-y-0">
        <Byline author="Ryan Gan">
          {project.role} /{' '}
          {format(parseContentDate(project.date), 'MMM dd, yyyy')}
        </Byline>

        <div className="flex items-center space-x-4 font-semibold">
          {project.link?.github && (
            <Link
              href={project.link.github}
              target="_blank"
              className="flex items-center"
            >
              <SocialIcon name="github" size={20} className="mr-1 shrink-0" />
              <span className="text-blue-700 hover:underline dark:text-blue-400">
                Repository
              </span>
            </Link>
          )}
          {project.link?.live && (
            <Link
              href={project.link.live}
              target="_blank"
              className="flex items-center"
            >
              <SocialIcon name="website" size={20} className="mr-1 shrink-0" />
              <span className="whitespace-nowrap text-blue-700 hover:underline dark:text-blue-400">
                Live Demo
              </span>
            </Link>
          )}
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-4">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="flex cursor-default items-center space-x-2"
          >
            <TechStackIcon name={tech} size={16} />
            <span className="text-xs font-medium text-black uppercase dark:text-white">
              {techStack[tech].label}
            </span>
          </span>
        ))}
      </section>

      <Callout>
        <p className="mb-0 font-medium italic">{project.summary}</p>
      </Callout>

      {thumbnailFallback ?? (
        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          width={0}
          height={0}
          sizes={contentImageSizes}
          className="h-auto w-full rounded-lg shadow-md"
          quality={95}
          priority
          placeholder="blur"
          blurDataURL="/blur.svg"
        />
      )}
    </>
  );
};

export default ProjectHeader;
