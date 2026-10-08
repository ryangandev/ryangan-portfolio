'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

import { cn } from '@/lib/utils';

type FadeInImageProps = ImageProps & {
  /**
   * A tiny copy of the image as a data URL, from `getImagePlaceholder`, shown
   * blurred in its place until it loads. Without one, a grey skeleton pulses
   * there instead.
   */
  placeholderSrc?: string;
  /**
   * The wrapper that holds the placeholder: give it the image's shape (its
   * rounding) and its place in the layout (its margins, or `absolute inset-0`
   * for a `fill` image). It is a block, as Tailwind's preflight makes every
   * `<img>`, so it lays out like the image it wraps and swapping one in moves
   * nothing.
   */
  wrapperClassName?: string;
  /**
   * Classes for the image only while it loads, for holding its space when its
   * size is not known up front, such as an aspect ratio. Prefix them with
   * `scripting:`; without script nothing ever removes them.
   */
  loadingClassName?: string;
};

/**
 * next/image over a blurred copy of itself, fading in once it has loaded, so
 * a slow image arrives as a soft preview sharpening rather than a blank gap.
 *
 * The blur is the tiny copy scaled up and blurred by a share of the wrapper's
 * width (`cqw`), so a 40px avatar and a full-width screenshot look equally
 * soft. It is scaled past the wrapper and clipped, because a blur fades its
 * own edges to transparent. Once the image has faded in over it, it is hidden,
 * so it never shows through an image with transparent parts.
 *
 * The fade sits behind `scripting:`, because only script can end it; without
 * script the image simply shows over the blur as it loads. An image that
 * finished loading before hydration is still caught: next/image checks
 * `complete` when it mounts and calls `onLoad` then.
 */
const FadeInImage = ({
  alt,
  className,
  placeholderSrc,
  wrapperClassName,
  loadingClassName,
  onLoad,
  onError,
  ...props
}: FadeInImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <span
      className={cn(
        '@container relative block transition-colors duration-300',
        !isLoaded && !placeholderSrc && 'scripting:skeleton',
        wrapperClassName,
      )}
    >
      {placeholderSrc && (
        <span
          aria-hidden
          className={cn(
            'absolute inset-0 overflow-hidden rounded-[inherit]',
            isLoaded && 'invisible transition-[visibility] delay-300',
          )}
        >
          <span
            className="block size-full scale-125 bg-cover bg-center blur-[3cqw]"
            style={{ backgroundImage: `url("${placeholderSrc}")` }}
          />
        </span>
      )}
      <Image
        {...props}
        alt={alt}
        className={cn(
          'relative transition-opacity duration-300',
          !isLoaded && cn('scripting:opacity-0', loadingClassName),
          className,
        )}
        onLoad={(event) => {
          setIsLoaded(true);
          onLoad?.(event);
        }}
        // A broken image should not pulse forever; this shows its alt text.
        onError={(event) => {
          setIsLoaded(true);
          onError?.(event);
        }}
      />
    </span>
  );
};

export default FadeInImage;
