import { Metadata } from 'next';

import BlogList from '@/components/blog/blog-list';
import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
};

export default function Page() {
  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Blog</h1>
      <PageSummary>
        Welcome to my blog! I share insights and lessons from my journey in
        software development and beyond.
      </PageSummary>
      <BlogList />
    </main>
  );
}
