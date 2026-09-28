import React from 'react';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import PostNavigation from '@/components/blog/post-navigation';
import TopicList from '@/components/blog/topic-list';
import ViewCounter from '@/components/blog/view-counter';
import Byline from '@/components/byline';
import Callout from '@/components/callout';
import Mdx from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import { feedAlternates, siteName } from '@/data/site';
import {
  getAdjacentPosts,
  getAllPostSlugs,
  getPostBySlug,
} from '@/lib/content';
import { parseContentDate } from '@/lib/date';

export const generateStaticParams = async () => {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: '404 Post Not Found - Blog',
    };
  }

  const url = `/blog/${post.slug}`;

  return {
    title: post.title + ' - Blog',
    description: post.summary,
    alternates: {
      canonical: url,
      ...feedAlternates,
    },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      siteName,
      locale: 'en_US',
      type: 'article',
      publishedTime: parseContentDate(post.publishedDate).toISOString(),
      authors: [post.author],
      tags: post.topics,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
    },
  };
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, adjacent] = await Promise.all([
    getPostBySlug(slug),
    getAdjacentPosts(slug),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative">
      <BackButton name="Blog" href="/blog" />

      <article className="space-y-8">
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>

        <section className="space-y-3 text-sm md:flex md:items-center md:justify-between md:space-y-0">
          <Byline author={post.author}>
            Published on{' '}
            {format(parseContentDate(post.publishedDate), 'MMM dd, yyyy')}
          </Byline>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span>{post.readingTime} min read</span>
            <ViewCounter slug={post.slug} />
          </div>
        </section>
        {post.summary && (
          <Callout>
            <p className="mb-0 font-medium italic">{post.summary}</p>
          </Callout>
        )}

        <section className="prose max-w-[644px] dark:prose-invert">
          <Mdx source={post.content} />
        </section>

        <footer className="space-y-8 border-t pt-8">
          <TopicList topics={post.topics} />
          <PostNavigation {...adjacent} />
        </footer>
      </article>
    </main>
  );
}
