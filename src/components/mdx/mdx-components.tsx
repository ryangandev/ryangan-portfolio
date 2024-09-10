import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';

import CustomImage from '@/components/mdx/custom-image';
import CustomLink from '@/components/mdx/custom-link';
// import CustomPre from '@/components/mdx/custom-pre';
import { options } from '@/data/mdx-options';
import '@/styles/mdx.css';
import dynamic from 'next/dynamic';

const CustomPre = dynamic(() => import('@/components/mdx/custom-pre'), {
  ssr: false,
});

type MdxProps = {
  source: MDXRemoteProps['source'];
};

const components = {
  a: CustomLink,
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
