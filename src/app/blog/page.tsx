import { Metadata } from 'next';

import SectionHeader from '@/components/section-header';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
};

export default function Page() {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <SectionHeader section="My Blog" />
        <PageSummary  content={["Welcome to my blog, where I share insights and lessons from my journey in software development and beyong."]}/>
      </div>
    </main>
  );
}
