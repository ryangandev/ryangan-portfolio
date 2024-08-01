import { Metadata } from 'next';

import BlogList from '@/components/blog/blog-list';
import SectionHeader from '@/components/section-header';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
};

const Page = () => {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeader section="My Blog" />
        <PageSummary
          content={[
            'Here I share insights and lessons from my journey in software development and beyong.',
          ]}
        />
        <BlogList />
      </div>
    </main>
  );
};

export default Page;
