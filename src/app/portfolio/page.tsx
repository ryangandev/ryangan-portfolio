import type { Metadata } from 'next';

import PageSummary from '@/components/page-summary';
import ProjectList from '@/components/portfolio/project-list';
import SectionHeader from '@/components/section-header';
import { getSortedProjectsData } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

const Page = async () => {
  const projects = await getSortedProjectsData();

  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Portfolio" />
        <PageSummary
          content={"Here are some of the projects I've worked on."}
        />
        <ProjectList projects={projects} />
      </div>
    </main>
  );
};

export default Page;
