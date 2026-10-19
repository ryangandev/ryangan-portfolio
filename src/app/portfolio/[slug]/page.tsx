import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/article-body';
import { compileMdx } from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import ProjectFacts from '@/components/portfolio/project-facts';
import ProjectHeader from '@/components/portfolio/project-header';
import ProjectNavigation from '@/components/portfolio/project-navigation';
import TableOfContents from '@/components/table-of-contents';
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
      {/* The gutters only exist from xl up. Below that the facts sit under
          the title, and there is no table of contents. The table of contents
          rides in the left-hand gutter under the back button, which sticks
          with it. The facts take the right-hand gutter and stick too, so it
          spans the article's height, but only in a `tall` window: in a
          shorter one they would run under the back-to-top link, so they
          scroll away with the header instead. */}
      <BackButton name="Portfolio" href="/portfolio">
        {headings.length > 1 && <TableOfContents headings={headings} />}
      </BackButton>
      <aside className="absolute inset-y-0 left-full hidden xl:block">
        <div className="ml-10 w-56 tall:sticky tall:top-32">
          <ProjectFacts
            project={project}
            stack={portfolioLayout.stack}
            placement="gutter"
          />
        </div>
      </aside>

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
