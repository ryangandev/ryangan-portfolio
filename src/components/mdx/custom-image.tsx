import React from 'react';
import Image, { ImageProps } from 'next/image';

const CustomImage: React.FC<ImageProps> = ({ ...props }) => {
  return (
    <Image
      {...props}
      alt={props.alt || ''}
      width={0}
      height={0}
      sizes="(max-width: 672px) 100%"
      className="h-auto w-full rounded-lg shadow-md"
      quality={95}
      placeholder="blur"
      blurDataURL="/blur.svg"
    />
  );
};

export default CustomImage;
