import React from 'react';
import { ImageProps } from 'next/image';

import FadeInImage from '@/components/fade-in-image';
import ViewableImage from '@/components/image-viewer/viewable-image';
import { cn } from '@/lib/utils';
import { contentImageSizes } from '@/data/site';
import { getImagePlaceholder } from '@/lib/image-placeholder';

/**
 * Where an image sits in an `ImageGallery`: across the column, or one of two
 * to a row from `md` up
 */
export type GalleryPlace = 'wide' | 'tile';

/** Half the 644px column, less half the 16px gap, once there are two columns */
const tileSizes = '(min-width: 768px) 314px, calc(100vw - 48px)';

/**
 * An image written in MDX, which opens full size in the image viewer when
 * clicked. Its size is unknown until it loads, so while it loads it holds an
 * 8:5 box, the shape of most screenshots here. The viewer button takes over
 * the margins prose gives an image, and `not-prose` keeps prose from adding
 * them to the image as well.
 *
 * In a gallery the gallery spaces the images instead, each is captioned with
 * its alt text, and a tile is cropped to 8:5 from the top, where a page's
 * heading is.
 */
const CustomImage = async ({
  gallery,
  ...props
}: ImageProps & { gallery?: GalleryPlace }) => {
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
      sizes={gallery === 'tile' ? tileSizes : contentImageSizes}
      wrapperClassName="w-full rounded-lg"
      className={cn(
        'h-auto w-full rounded-lg shadow-md',
        gallery === 'tile' && 'md:aspect-[8/5] md:object-cover md:object-top',
      )}
      loadingClassName="scripting:aspect-[8/5]"
      quality={95}
    />
  );

  // In a gallery, the gallery spaces the images; a wide one spans its row.
  const place = gallery
    ? cn(gallery === 'wide' && 'md:col-span-2')
    : 'my-[2em]';

  const caption = gallery && alt && (
    <span className="mt-2 block truncate text-[13px] leading-[18px] text-muted-foreground">
      {alt}
    </span>
  );

  if (typeof props.src !== 'string') {
    return (
      <span className={cn('not-prose block', place)}>
        {image}
        {caption}
      </span>
    );
  }

  return (
    <ViewableImage
      src={props.src}
      alt={alt}
      className={cn('not-prose rounded-lg', place)}
    >
      {image}
      {caption}
    </ViewableImage>
  );
};

export default CustomImage;
