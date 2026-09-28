import React from 'react';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import Byline from '@/components/byline';
import Callout from '@/components/callout';
import SocialIcon from '@/components/icons/social-icon';
import TechStackIcon from '@/components/icons/tech-stack-icon';
import Mdx from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import { contentImageSizes, siteName } from '@/data/site';
import { techStack } from '@/data/tech-stack';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content';
import { parseContentDate } from '@/lib/date';

export const generateStaticParams = async () => {
  const slugs = await getAllProjectSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: '404 Project Not Found - Portfolio',
    };
  }

  const url = `/portfolio/${project.slug}`;

  return {
    title: project.title + ' - Portfolio',
    description: project.summary,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      siteName,
      locale: 'en_US',
      type: 'article',
      publishedTime: parseContentDate(project.date).toISOString(),
      // The project's own thumbnail beats the site-wide card here — a link to a
      // project should preview as that project.
      images: [{ url: project.thumbnailUrl, alt: project.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.summary,
      images: [project.thumbnailUrl],
    },
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="relative">
      <BackButton name="Portfolio" href="/portfolio" />

      <article className="space-y-8">
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
                <SocialIcon
                  name="website"
                  size={20}
                  className="mr-1 shrink-0"
                />
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

        <section className="prose max-w-[644px] dark:prose-invert">
          <Mdx source={project.content} />
        </section>
      </article>
    </main>
  );
}
