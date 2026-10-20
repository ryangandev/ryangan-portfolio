import React from 'react';

import type { GalleryPlace } from '@/components/mdx/custom-image';

/**
 * Images written one after another in MDX, as a project's screenshots are,
 * grouped by `groupImages`. On a phone they stay one per row. From `md` up
 * the first spans the column, full size, and the rest sit two to a row
 * below it, cropped to the 8:5 of most screenshots, so seven take about as
 * much page as three did. With an odd number after the first, the last spans
 * the column too, so no row is left half empty. Every one is captioned with
 * its alt text, since a tile is too small to tell one page from another.
 *
 * Each image still opens full size, uncropped, in the image viewer.
 */
const ImageGallery = ({ children }: { children: React.ReactNode }) => {
  const images = React.Children.toArray(children).filter(React.isValidElement);
  const lastIsAlone = images.length % 2 === 0;

  return (
    <div className="not-prose my-[2em] grid gap-y-8 md:grid-cols-2 md:gap-x-4 md:gap-y-6">
      {images.map((image, index) => {
        const place: GalleryPlace =
          index === 0 || (lastIsAlone && index === images.length - 1)
            ? 'wide'
            : 'tile';

        return React.cloneElement(
          image as React.ReactElement<{ gallery?: GalleryPlace }>,
          { gallery: place },
        );
      })}
    </div>
  );
};

export default ImageGallery;
