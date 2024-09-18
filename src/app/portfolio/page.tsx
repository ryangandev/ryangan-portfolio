import type { Metadata } from 'next';

import PageSummary from '@/components/page-summary';
import ProjectList from '@/components/portfolio/project-list';
import { getSortedProjects } from '@/lib/content';
import BackButton from '@/components/navigation/back-button';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

export default async function Page() {
  const projects = await getSortedProjects();

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Portfolio</h1>
      <PageSummary>
        Here is a seletion of the projects I&apos;ve worked on. I&apos;m always
        open to feedback and opportunities to collaborate!
      </PageSummary>
      <ProjectList projects={projects} />
    </main>
  );
}
