import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import Callout from '@/components/callout';
import CustomCode from '@/components/mdx/custom-code';
import CustomImage from '@/components/mdx/custom-image';
import CustomLink from '@/components/mdx/custom-link';
import CustomPre from '@/components/mdx/custom-pre';
import '@/styles/mdx.css';

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

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: {
            light: 'min-light',
            dark: 'min-dark',
          },
          keepBackground: false,
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['subheading-anchor'],
            ariaLabel: 'Link to section',
          },
        },
      ],
    ],
  },
} as MDXRemoteProps['options'];

const Mdx: React.FC<MdxProps> = ({ source, ...props }) => {
  return (
    <MDXRemote
      {...props}
      source={source}
      components={components}
      options={options}
    />
  );
};

export default Mdx;
