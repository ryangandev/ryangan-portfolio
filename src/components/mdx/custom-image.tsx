import React from 'react';
import Image, { ImageProps } from 'next/image';

const CustomImage: React.FC<ImageProps> = ({ ...props }) => {
  return (
    <Image
      width={672}
      height={468}
      quality={95}
      className="rounded-lg"
      {...props}
    />
  );
};

export default CustomImage;
