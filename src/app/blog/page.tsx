import { Metadata } from 'next';

import BlogList from '@/components/blog/blog-list';
import Heading from '@/components/heading';
import PageSummary from '@/components/page-summary';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
};

const Page = () => {
  return (
    <main className="contentContainerPadding">
      <div className="mx-auto w-full max-w-2xl">
        <Heading shadowed>Blog</Heading>
        <PageSummary>
          Welcome to my blog! I share insights and lessons from my journey in
          software development and beyond.
        </PageSummary>
        <BlogList />
      </div>
    </main>
  );
};

export default Page;
