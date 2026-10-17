import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/article-body';
import TableOfContents from '@/components/blog/table-of-contents';
import { compileMdx } from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
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
      <BackButton name="Portfolio" href="/portfolio" />
      {/* The gutters only exist from xl up. Below that the facts sit under
          the title, and there is no table of contents. The facts take the
          right-hand gutter and scroll away with the header they belong to;
          the table of contents takes the left, under the back button and
          aligned with it, and sticks while the article scrolls. Each gutter
          spans the article's height for that. */}
      <aside className="absolute top-0 left-full hidden xl:block">
        <div className="ml-10 w-56">
          <ProjectFacts
            project={project}
            stack={portfolioLayout.stack}
            placement="gutter"
          />
        </div>
      </aside>
      {headings.length > 1 && (
        // 192px wide, so its left edge lines up with the back button's at
        // `lg:-left-48`.
        <aside className="absolute top-0 right-full hidden h-full xl:block">
          <div className="sticky top-32 mt-16 mr-10 w-38">
            <TableOfContents headings={headings} />
          </div>
        </aside>
      )}

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
