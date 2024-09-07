import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';

import Callout from '@/components/callout';
import Heading from '@/components/heading';
import Mdx from '@/components/mdx/mdx-components';
import SocialIcon from '@/components/social-icon';
import TechStackIcon from '@/components/tech-stack-icon';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content';
import { TechStackIconName } from '@/models/data';

export const generateStaticParams = async () => {
  const slugs = await getAllProjectSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  return {
    title: project.title + ' - Portfolio',
  };
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  return (
    <main className="contentContainerPadding">
      <article className="mx-auto max-w-2xl space-y-8">
        <Heading size="lg" hasMarginBottom={false}>
          {project.title}
        </Heading>

        <section className="space-y-3 md:flex md:justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Image
              src="https://ik.imagekit.io/ryangan/profile-icon.jpeg?updatedAt=1718985313938"
              alt="Ryan Gan"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10 rounded-full"
              quality={95}
              priority
            />
            <div className="flex flex-col">
              <span className="font-medium">Ryan Gan</span>
              <span className="text-muted-foreground">
                {project.role} /{' '}
                {format(new Date(project.date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>

          <div className="ml-2.5 flex items-end space-x-4 font-semibold md:ml-0">
            {project.link.github && (
              <Link
                href={project.link.github}
                target="_blank"
                className="flex items-center"
              >
                <SocialIcon name="github" size={20} className="mr-1" />
                <span className="text-blue-700 hover:underline dark:text-blue-400">
                  Repository
                </span>
              </Link>
            )}
            {project.link.live && (
              <Link
                href={project.link.live}
                target="_blank"
                className="flex items-center"
              >
                <SocialIcon name="website" size={20} className="mr-1" />
                <span className="text-blue-700 hover:underline dark:text-blue-400">
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
              <TechStackIcon name={tech as TechStackIconName} size={16} />
              <span className="text-xs font-medium uppercase text-black dark:text-white">
                {tech}
              </span>
            </span>
          ))}
        </section>

        <Callout>
          <p className="font-medium italic">{project.summary}</p>
        </Callout>

        <Image
          src={project.thumbnailUrl}
          alt={project.title}
          width={0}
          height={0}
          sizes="(max-width: 672px) 100%"
          className="h-auto w-full rounded-lg"
          quality={95}
          priority
          placeholder="blur"
          blurDataURL="/blur.svg"
        />

        <section className="prose max-w-none dark:prose-invert">
          <Mdx source={project.content} />
        </section>
      </article>
    </main>
  );
};

export default Page;