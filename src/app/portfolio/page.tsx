import type { Metadata } from 'next';

import PageSummary from '@/components/page-summary';
import ProjectList from '@/components/portfolio/project-list';
import SectionHeader from '@/components/section-header';
import { getSortedProjects } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

const Page = async () => {
  const projects = await getSortedProjects();

  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Portfolio" />
        <PageSummary
          content={
            "Here is a seletion of the projects I've worked on. I'm always open to feedback and opportunities to collaborate!"
          }
        />
        <ProjectList projects={projects} />
      </div>
    </main>
  );
};

export default Page;
