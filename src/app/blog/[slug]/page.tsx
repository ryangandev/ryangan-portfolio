import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import Callout from '@/components/callout';
import Mdx from '@/components/mdx/mdx-components';
import BackButton from '@/components/navigation/back-button';
import { getAllPostSlugs, getPostBySlug } from '@/lib/content';
import { PostData } from '@/models/post';

/**
 * Get post data by slug or null if post is not found
 */
const getPostData = async (slug: string): Promise<PostData | null> => {
  const allSlugs = await getAllPostSlugs();
  if (!allSlugs.includes(slug)) {
    return null;
  }

  try {
    const post = await getPostBySlug(slug);
    return post;
  } catch (error) {
    console.error(`Error fetching post data for slug ${slug}:`, error);
    return null;
  }
};

export const generateStaticParams = async () => {
  const slugs = await getAllPostSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const post = await getPostData(slug);

  if (!post) {
    return {
      title: '404 Post Not Found - Blog',
    };
  }

  return {
    title: post.title + ' - Blog',
  };
};

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }
  console.log('post', post.publishedDate);
  return (
    <main className="relative">
      <BackButton name="Blog" href="/blog" />

      <article className="space-y-8">
        <h1 className="text-3xl font-bold md:text-4xl">{post.title}</h1>

        <section className="space-y-3 md:flex md:justify-between">
          <div className="flex items-center space-x-2 text-sm">
            <Image
              src="https://ik.imagekit.io/ryangan/profile-icon.jpeg?updatedAt=1718985313938"
              alt="Ryan Gan"
              width={0}
              height={0}
              sizes="100vw"
              className="h-auto w-10 rounded-full"
              quality={95}
              priority
            />
            <div className="flex flex-col">
              <span className="font-medium">{post.author}</span>
              <span className="text-muted-foreground">
                Published on{' '}
                {format(new Date(post.publishedDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </section>

        <Callout>
          <p className="mb-0 font-medium italic">{post.summary}</p>
        </Callout>

        <section className="prose max-w-[644px] dark:prose-invert">
          <Mdx source={post.content} />
        </section>
      </article>
    </main>
  );
}
