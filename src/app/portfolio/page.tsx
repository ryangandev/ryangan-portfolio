import { Metadata } from 'next';

import SectionHeader from '@/components/section-header';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Portfolio - Ryan Gan',
};

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="Portfolio" />
        <PageSummary content={["Here are some of the projects I've worked on."]}/>
      </div>
    </main>
  );
}
