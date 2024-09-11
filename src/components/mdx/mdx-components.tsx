import React from 'react';
import dynamic from 'next/dynamic';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';

import CustomImage from '@/components/mdx/custom-image';
import CustomLink from '@/components/mdx/custom-link';
import { options } from '@/data/mdx-options';
import '@/styles/mdx.css';

// Needs to be imported dynamically because it's a client component
const CustomCode = dynamic(() => import('@/components/mdx/custom-code'), {
  ssr: false,
});
const CustomPre = dynamic(() => import('@/components/mdx/custom-pre'), {
  ssr: false,
});

type MdxProps = {
  source: MDXRemoteProps['source'];
};

const components = {
  a: CustomLink,
  code: CustomCode,
  img: CustomImage,
  pre: CustomPre,
} as MDXRemoteProps['components'];

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
