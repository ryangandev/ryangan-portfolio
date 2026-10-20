import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ArticleBody from '@/components/article-body';
import PostHeader from '@/components/blog/post-header';
import PostNavigation from '@/components/blog/post-navigation';
import PostFacts from '@/components/blog/post-facts';
import { PostViews } from '@/components/blog/post-views';
import TopicList from '@/components/blog/topic-list';
import JsonLd from '@/components/json-ld';
import { compileMdx } from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import ContentsGutter from '@/components/navigation/contents-gutter';
import { feedAlternates, siteName, siteUrl } from '@/data/site';
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

  const { content, headings } = await compileMdx(post.content);

  return (
    <main className="relative">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.summary,
          datePublished: post.publishedDate,
          url: `${siteUrl}/blog/${post.slug}`,
          mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
          image: `${siteUrl}/blog/${post.slug}/opengraph-image`,
          keywords: post.topics,
          author: {
            '@type': 'Person',
            name: post.author,
            url: siteUrl,
          },
        }}
      />
      <div className="reading-progress" aria-hidden />
      {/* As on a project page: the gutters only exist from xl up, the facts
          ride in the left-hand one under the back button, and the table of
          contents sticks in the right-hand one. Below xl the byline under
          the title carries the facts, and there is no table of contents. */}
      <PostViews slug={post.slug}>
        <BackButton name="Blog" href="/blog">
          <PostFacts
            publishedDate={post.publishedDate}
            readingTime={post.readingTime}
            topics={post.topics}
          />
        </BackButton>
        {headings.length > 1 && <ContentsGutter headings={headings} />}

        <article className="space-y-8">
          <PostHeader
            title={post.title}
            author={post.author}
            publishedDate={post.publishedDate}
            readingTime={post.readingTime}
            summary={post.summary}
            factsInGutter
          />

          <ArticleBody>{content}</ArticleBody>

          <footer className="space-y-8 border-t pt-8">
            <TopicList topics={post.topics} />
            <PostNavigation {...adjacent} />
          </footer>
        </article>
      </PostViews>
    </main>
  );
}
