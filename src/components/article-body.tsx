import React from 'react';

import ImageViewerProvider from '@/components/image-viewer/image-viewer-provider';

/**
 * The rendered MDX of a post or project, in the site's prose style.
 * `prose-neutral` keeps it on the same pure grey scale as the rest of the
 * site; the plugin's default, `gray`, is tinted blue.
 *
 * Its images open in the image viewer, which browses every image in it.
 */
const ArticleBody = ({ children }: { children: React.ReactNode }) => {
  return (
    <section
      data-image-gallery
      className="prose max-w-[644px] prose-neutral dark:prose-invert"
    >
      <ImageViewerProvider>{children}</ImageViewerProvider>
    </section>
  );
};

export default ArticleBody;
