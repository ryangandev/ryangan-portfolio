import React from 'react';
import { compileMDX, MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import Callout from '@/components/callout';
import CustomCode from '@/components/mdx/custom-code';
import CustomImage from '@/components/mdx/custom-image';
import CustomLink from '@/components/mdx/custom-link';
import CustomPre from '@/components/mdx/custom-pre';

type MdxProps = {
  source: MDXRemoteProps['source'];
};

const components = {
  a: CustomLink,
  code: CustomCode,
  img: CustomImage,
  pre: CustomPre,
  Callout,
} as MDXRemoteProps['components'];

/** A section heading, as rehype-slug left it */
export type MdxHeading = {
  id: string;
  text: string;
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === 'text'
    ? (node.value ?? '')
    : (node.children ?? []).map(textOf).join('');

/**
 * A rehype plugin that records every `h2` with the id rehype-slug gave it.
 *
 * It runs inside the real pipeline, directly after rehype-slug, so the ids are
 * exactly the ones in the rendered page. Re-deriving them from the Markdown
 * would mean re-implementing the slugger and stripping inline code, links, and
 * emphasis the way rehype does, and drifting the first time either differed.
 */
const collectHeadings = (headings: MdxHeading[]) => () => (tree: HastNode) => {
  const visit = (node: HastNode) => {
    if (node.tagName === 'h2' && typeof node.properties?.id === 'string') {
      headings.push({ id: node.properties.id, text: textOf(node).trim() });
    }

    node.children?.forEach(visit);
  };

  visit(tree);
};

const prettyCode = [
  rehypePrettyCode,
  {
    theme: {
      light: 'min-light',
      dark: 'min-dark',
    },
    keepBackground: false,
  },
];

const autolinkHeadings = [
  rehypeAutolinkHeadings,
  {
    properties: {
      className: ['subheading-anchor'],
      ariaLabel: 'Link to section',
    },
  },
];

const buildOptions = (headings?: MdxHeading[]) =>
  ({
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        ...(headings ? [collectHeadings(headings)] : []),
        prettyCode,
        autolinkHeadings,
      ],
    },
  }) as MDXRemoteProps['options'];

/**
 * Compile MDX once, returning the rendered content along with its section
 * headings, for pages that show a table of contents
 */
export const compileMdx = async (
  source: string,
): Promise<{ content: React.ReactElement; headings: MdxHeading[] }> => {
  const headings: MdxHeading[] = [];
  const { content } = await compileMDX({
    source,
    components,
    options: buildOptions(headings),
  });

  return { content, headings };
};

const Mdx: React.FC<MdxProps> = ({ source, ...props }) => {
  return (
    <MDXRemote
      {...props}
      source={source}
      components={components}
      options={buildOptions()}
    />
  );
};

export default Mdx;
