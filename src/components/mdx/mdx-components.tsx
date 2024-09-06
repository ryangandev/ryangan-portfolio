import React from 'react';
import { MDXRemote, MDXRemoteProps } from 'next-mdx-remote/rsc';

import CustomImage from '@/components/mdx/custom-image';
import { options } from '@/data/mdx-options';

type MdxProps = {
  source: MDXRemoteProps['source'];
};

const components = {
  img: CustomImage,
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
