import { Metadata } from 'next';

import SectionHeader from '@/components/section-header';
import PageSummary from '@/components/page-summary';
import PortfolioList from '@/components/portfolio/portfolio-list';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

const Page = () => {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeader section="Portfolio" />
        <PageSummary
          content={["Here are some of the projects I've worked on."]}
        />
        <PortfolioList />
      </div>
    </main>
  );
};

export default Page;
