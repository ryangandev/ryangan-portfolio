import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PostArchive from '@/components/blog/post-archive';
import BackButton from '@/components/navigation/back-button';
import PageSummary from '@/components/page-summary';
import { feedAlternates, siteName } from '@/data/site';
import { getTopicBySlug, getTopics } from '@/lib/content';

type TopicPageProps = {
  params: Promise<{ topic: string }>;
};

// Every topic is known at build time; anything else is a 404 without a render.
export const dynamicParams = false;

export const generateStaticParams = async () => {
  const topics = await getTopics();

  return topics.map((topic) => ({ topic: topic.slug }));
};

export const generateMetadata = async ({
  params,
}: TopicPageProps): Promise<Metadata> => {
  const topic = await getTopicBySlug((await params).topic);

  if (!topic) {
    return {};
  }

  const title = `${topic.name} - Blog - Ryan Gan`;
  const description = `Posts about ${topic.name}.`;
  const url = `/blog/topics/${topic.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url, ...feedAlternates },
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: 'en_US',
      type: 'website',
    },
  };
};

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getTopicBySlug((await params).topic);

  if (!topic) {
    notFound();
  }

  const count = topic.posts.length;

  return (
    <main className="relative">
      <BackButton name="Blog" href="/blog" />
      <h1>{topic.name}</h1>
      <PageSummary>
        {count} {count === 1 ? 'post' : 'posts'} about {topic.name}.
      </PageSummary>
      <PostArchive posts={topic.posts} />
    </main>
  );
}
