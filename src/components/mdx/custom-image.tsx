import React from 'react';
import { ImageProps } from 'next/image';

import FadeInImage from '@/components/fade-in-image';
import { contentImageSizes } from '@/data/site';
import { getImagePlaceholder } from '@/lib/image-placeholder';

/**
 * An image written in MDX. Its size is unknown until it loads, so while it
 * loads it holds an 8:5 box, the shape of most screenshots here. The wrapper
 * takes over the margins prose gives an image, and `not-prose` keeps prose
 * from adding them to the image as well.
 */
const CustomImage = async (props: ImageProps) => {
  return (
    <FadeInImage
      {...props}
      placeholderSrc={
        typeof props.src === 'string'
          ? await getImagePlaceholder(props.src)
          : undefined
      }
      alt={props.alt || ''}
      width={0}
      height={0}
      sizes={contentImageSizes}
      wrapperClassName="not-prose my-[2em] w-full rounded-lg"
      className="h-auto w-full rounded-lg shadow-md"
      loadingClassName="scripting:aspect-[8/5]"
      quality={95}
    />
  );
};

export default CustomImage;
