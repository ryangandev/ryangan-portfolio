import React from 'react';
import { ImageProps } from 'next/image';

import FadeInImage from '@/components/fade-in-image';
import ViewableImage from '@/components/image-viewer/viewable-image';
import { contentImageSizes } from '@/data/site';
import { getImagePlaceholder } from '@/lib/image-placeholder';

/**
 * An image written in MDX, which opens full size in the image viewer when
 * clicked. Its size is unknown until it loads, so while it loads it holds an
 * 8:5 box, the shape of most screenshots here. The viewer button takes over
 * the margins prose gives an image, and `not-prose` keeps prose from adding
 * them to the image as well.
 */
const CustomImage = async (props: ImageProps) => {
  const alt = props.alt || '';

  const image = (
    <FadeInImage
      {...props}
      placeholderSrc={
        typeof props.src === 'string'
          ? await getImagePlaceholder(props.src)
          : undefined
      }
      alt={alt}
      width={0}
      height={0}
      sizes={contentImageSizes}
      wrapperClassName="w-full rounded-lg"
      className="h-auto w-full rounded-lg shadow-md"
      loadingClassName="scripting:aspect-[8/5]"
      quality={95}
    />
  );

  if (typeof props.src !== 'string') {
    return <span className="not-prose my-[2em] block">{image}</span>;
  }

  return (
    <ViewableImage
      src={props.src}
      alt={alt}
      className="not-prose my-[2em] rounded-lg"
    >
      {image}
    </ViewableImage>
  );
};

export default CustomImage;
