'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

import ImageViewer, { type ViewerImage } from './image-viewer';

type OpenViewer = (trigger: HTMLElement) => void;

const ImageViewerContext = createContext<OpenViewer | null>(null);

/** Opens the viewer at a trigger, or null outside an `ImageViewerProvider` */
export const useOpenImageViewer = () => useContext(ImageViewerContext);

/**
 * Reads what the viewer needs from a trigger `ViewableImage` rendered. The
 * image on the page has usually loaded by the time it is clicked, so its own
 * file stands in, already decoded, while the full-size one loads, and its
 * shape lays the viewer out before then.
 */
const readImage = (trigger: HTMLElement): ViewerImage => {
  const image = trigger.querySelector('img');
  const loaded = image?.complete && image.naturalWidth > 0;

  return {
    src: trigger.dataset.viewerSrc ?? '',
    alt: trigger.dataset.viewerAlt ?? '',
    preview: loaded ? image.currentSrc : undefined,
    // The 8:5 an MDX image holds while it loads, for one that has not
    width: loaded ? image.naturalWidth : 8,
    height: loaded ? image.naturalHeight : 5,
  };
};

/**
 * Lets every `ViewableImage` inside it open the image viewer, which browses
 * all of them in page order. The images are read from the page when the
 * viewer opens, so nothing registers itself and the order is always the
 * order a reader sees.
 */
export default function ImageViewerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [viewer, setViewer] = useState<{
    images: ViewerImage[];
    triggers: HTMLElement[];
    index: number;
  } | null>(null);

  const open = useCallback<OpenViewer>((trigger) => {
    const scope = trigger.closest('[data-image-gallery]') ?? document;
    const triggers = Array.from(
      scope.querySelectorAll<HTMLElement>('[data-viewer-src]'),
    );

    setViewer({
      images: triggers.map(readImage),
      triggers,
      index: Math.max(0, triggers.indexOf(trigger)),
    });
  }, []);

  const close = useCallback(() => setViewer(null), []);

  return (
    <ImageViewerContext value={open}>
      {children}
      {viewer && (
        <ImageViewer
          images={viewer.images}
          triggers={viewer.triggers}
          initialIndex={viewer.index}
          onClose={close}
        />
      )}
    </ImageViewerContext>
  );
}
