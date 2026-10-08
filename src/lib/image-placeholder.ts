import { cache } from 'react';

/**
 * A 16px-wide copy of an ImageKit image, as a data URL, for `FadeInImage` to
 * show blurred in the image's place while the image itself loads. ImageKit
 * resizes on request, so this is one fetch of about 100 bytes per image, made
 * while a static page builds and cached after that; the `updatedAt` in every
 * URL here keeps a replaced image from reusing a stale copy.
 *
 * An image from anywhere else, or a failed fetch, gets no placeholder, and
 * `FadeInImage` shows its grey skeleton instead: a missing blur is cosmetic,
 * so it warns rather than failing the build.
 */
export const getImagePlaceholder = cache(
  async (src: string): Promise<string | undefined> => {
    if (!URL.canParse(src)) return undefined;
    const url = new URL(src);
    if (url.hostname !== 'ik.imagekit.io') return undefined;
    url.searchParams.set('tr', 'w-16,q-50,f-webp');

    try {
      const response = await fetch(url, { cache: 'force-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      return `data:image/webp;base64,${bytes.toString('base64')}`;
    } catch (error) {
      console.warn(`No image placeholder for ${src}:`, error);
      return undefined;
    }
  },
);
