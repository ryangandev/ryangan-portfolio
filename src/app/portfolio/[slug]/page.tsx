import React from 'react';

import Mdx from '@/components/mdx-components';
import { getAllProjectSlugs, getProjectBySlug } from '@/lib/content';

export const generateStaticParams = async () => {
  const slugs = await getAllProjectSlugs();

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
  const project = await getProjectBySlug(slug);

  return {
    title: project.title + ' - Portfolio',
  };
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const project = await getProjectBySlug(slug);

  return (
    <main className="contentContainerPadding">
      <article className="prose mx-auto w-full max-w-2xl dark:prose-invert">
        <h1>{project.title}</h1>
        <Mdx source={project.content} />
      </article>
    </main>
  );
};

export default Page;
