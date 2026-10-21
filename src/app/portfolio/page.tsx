import type { Metadata } from 'next';

import PageSummary from '@/components/page-summary';
import ProjectIndex from '@/components/portfolio/project-index';
import { getSortedProjects } from '@/lib/content';
import { getImagePlaceholder } from '@/lib/image-placeholder';
import { portfolioLayout } from '@/lib/portfolio-layout';
import BackButton from '@/components/navigation/back-button';
import { pageTitle, siteName } from '@/data/site';

const description =
  "Projects I've built for myself, for clients, and with teams.";

export const metadata: Metadata = {
  title: pageTitle('Portfolio'),
  description,
  alternates: { canonical: '/portfolio' },
  openGraph: {
    title: pageTitle('Portfolio'),
    description,
    url: '/portfolio',
    siteName,
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Page() {
  const projects = await getSortedProjects();
  const thumbnailPlaceholders = Object.fromEntries(
    await Promise.all(
      projects.map(
        async (project) =>
          [
            project.slug,
            await getImagePlaceholder(project.thumbnailUrl),
          ] as const,
      ),
    ),
  );

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Portfolio</h1>
      <PageSummary>
        Projects I&apos;ve built for myself, for clients, and with teams. Each
        page covers what it is, who it&apos;s for, and the parts I&apos;d point
        to.
      </PageSummary>
      <ProjectIndex
        projects={projects}
        thumbnailPlaceholders={thumbnailPlaceholders}
        layout={portfolioLayout.list}
      />
    </main>
  );
}
