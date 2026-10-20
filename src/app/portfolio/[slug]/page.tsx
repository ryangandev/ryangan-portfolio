import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/article-body';
import { compileMdx } from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import ContentsGutter from '@/components/navigation/contents-gutter';
import ProjectFacts from '@/components/portfolio/project-facts';
import ProjectHeader from '@/components/portfolio/project-header';
import ProjectNavigation from '@/components/portfolio/project-navigation';
import { siteName } from '@/data/site';
import {
  getAdjacentProjects,
  getAllProjectSlugs,
  getProjectBySlug,
} from '@/lib/content';
import { parseContentDate } from '@/lib/date';
import { portfolioLayout } from '@/lib/portfolio-layout';

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
  const [project, adjacent] = await Promise.all([
    getProjectBySlug(slug),
    getAdjacentProjects(slug),
  ]);

  if (!project) {
    notFound();
  }

  const { content, headings } = await compileMdx(project.content);

  return (
    <main className="relative">
      {/* The gutters only exist from xl up. The facts ride in the left-hand
          one under the back button, and the table of contents sticks in the
          right-hand one. Below xl the facts sit under the title, and there is
          no table of contents. */}
      <BackButton name="Portfolio" href="/portfolio">
        <ProjectFacts
          project={project}
          stack={portfolioLayout.stack}
          placement="gutter"
        />
      </BackButton>
      {headings.length > 1 && <ContentsGutter headings={headings} />}

      <article className="space-y-8">
        <ProjectHeader
          project={project}
          stack={portfolioLayout.stack}
          factsInGutter
        />

        <ArticleBody>{content}</ArticleBody>

        <footer className="border-t pt-8">
          <ProjectNavigation {...adjacent} />
        </footer>
      </article>
    </main>
  );
}
