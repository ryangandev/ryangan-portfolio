import React from 'react';
import Image from 'next/image';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';
import { options } from '@/data/mdx-options';

type MdxProps = {
  source: MDXRemoteProps['source'];
};

const components = {
  Image,
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
