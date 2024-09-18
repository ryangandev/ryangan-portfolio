import type { Metadata } from 'next';

import PageSummary from '@/components/page-summary';
import ProjectList from '@/components/portfolio/project-list';
import { getSortedProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

export default async function Page() {
  const projects = await getSortedProjects();

  return (
    <main className="">
      <div className="">
        <PageSummary>
          Here is a seletion of the projects I&apos;ve worked on. I&apos;m
          always open to feedback and opportunities to collaborate!
        </PageSummary>
        <ProjectList projects={projects} />
      </div>
    </main>
  );
}
