import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/article-body';
import Mdx from '@/components/mdx/mdx-components';
import ProjectHeader from '@/components/portfolio/project-header';
import BackButton from '@/components/navigation/back-button';
import { siteName } from '@/data/site';
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
      // The project's own thumbnail beats the site-wide card here - a link to a
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
        <ProjectHeader project={project} />

        <ArticleBody>
          <Mdx source={project.content} />
        </ArticleBody>
      </article>
    </main>
  );
}
