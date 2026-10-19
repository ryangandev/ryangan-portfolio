'use client';

import React from 'react';
import { LuMaximize2 } from 'react-icons/lu';

import { cn } from '@/lib/utils';

import { useOpenImageViewer } from './image-viewer-provider';

type ViewableImageProps = {
  /** The full-size file the viewer shows */
  src: string;
  alt: string;
  /** The image as the page shows it */
  children: React.ReactNode;
  /** Its place in the layout: its margins and rounding */
  className?: string;
};

/**
 * An image a reader can open full size in the image viewer. On hover or
 * keyboard focus it shows an expand mark in its corner, so it reads as
 * something to click. Outside an `ImageViewerProvider` it is just the image.
 */
export default function ViewableImage({
  src,
  alt,
  children,
  className,
}: ViewableImageProps) {
  const open = useOpenImageViewer();

  if (!open) return <span className={cn('block', className)}>{children}</span>;

  return (
    <button
      type="button"
      data-viewer-src={src}
      data-viewer-alt={alt}
      aria-label={alt ? `View full size: ${alt}` : 'View image full size'}
      aria-haspopup="dialog"
      onClick={(event) => open(event.currentTarget)}
      className={cn(
        'group relative block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring',
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute top-2.5 right-2.5 flex size-7 items-center justify-center rounded-full bg-white/90 text-neutral-800 opacity-0 shadow-sm backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:bg-neutral-900/85 dark:text-neutral-200"
      >
        <LuMaximize2 size={14} />
      </span>
    </button>
  );
}
