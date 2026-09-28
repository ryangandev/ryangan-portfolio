import { Metadata } from 'next';

import PostArchive from '@/components/blog/post-archive';
import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';
import { siteName } from '@/data/site';
import { getSortedPosts } from '@/lib/content';

const description =
  'Insights and lessons from my journey in software development.';

export const metadata: Metadata = {
  title: 'Blog - Ryan Gan',
  description,
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog - Ryan Gan',
    description,
    url: '/blog',
    siteName,
    locale: 'en_US',
    type: 'website',
  },
};

export default async function Page() {
  const posts = await getSortedPosts();

  return (
    <main className="relative">
      <BackButton name="Home" href="/" />
      <h1>Blog</h1>
      <PageSummary>
        Here I share insights and lessons from my journey in software
        development.
      </PageSummary>
      <PostArchive posts={posts} />
    </main>
  );
}
