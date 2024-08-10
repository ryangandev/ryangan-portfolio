import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getProjectData, getSortedProjectsData } from '@/libs/content';

export const generateStaticParams = async () => {
  const projects = await getSortedProjectsData();

  return projects.map((project) => ({
    slug: project.slug,
  }));
};

export const generateMetadata = async ({
  params,
}: {
  params: { slug: string };
}) => {
  const { slug } = params;
  const project = await getProjectData(slug);
  return {
    title: project.title + ' - Portfolio',
  };
};

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const project = await getProjectData(slug);

  return (
    <main className="contentContainerPadding">
      <article className="prose dark:prose-invert mx-auto w-full max-w-2xl">
        <h1>{project.title}</h1>
        <MDXRemote source={project.content} />
      </article>
    </main>
  );
};

export default Page;
