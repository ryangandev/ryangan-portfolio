import { Metadata } from 'next';

import PostArchive from '@/components/blog/post-archive';
import PageSummary from '@/components/page-summary';
import BackButton from '@/components/navigation/back-button';
import AnimatedLink from '@/components/animated-link';
import {
  blogDescription,
  blogTitle,
  feedAlternates,
  siteName,
} from '@/data/site';
import { getSortedPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  alternates: { canonical: '/blog', ...feedAlternates },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
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
        development. Follow along with the{' '}
        <AnimatedLink href="/feed.xml" isExternal>
          RSS feed
        </AnimatedLink>
        .
      </PageSummary>
      <PostArchive posts={posts} />
    </main>
  );
}
