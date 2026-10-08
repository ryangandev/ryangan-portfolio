import React from 'react';

import FadeInImage from '@/components/fade-in-image';
import { authorAvatarUrl } from '@/data/site';
import { getImagePlaceholder } from '@/lib/image-placeholder';

type BylineProps = {
  author: string;
  /** The line under the author's name, e.g. the publish date */
  children: React.ReactNode;
};

/**
 * Author avatar and name over a line of detail, as used at the top of posts
 * and projects.
 */
const Byline = async ({ author, children }: BylineProps) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <FadeInImage
        src={authorAvatarUrl}
        placeholderSrc={await getImagePlaceholder(authorAvatarUrl)}
        // Decorative: the author's name is printed right next to it.
        alt=""
        width={40}
        height={40}
        // The source is not square, so it is cropped to fill the circle rather
        // than squeezed into an oval.
        wrapperClassName="size-10 shrink-0 rounded-full"
        className="size-10 rounded-full object-cover"
        quality={95}
      />
      <div className="flex flex-col">
        <span className="font-medium">{author}</span>
        <span className="text-muted-foreground">{children}</span>
      </div>
    </div>
  );
};

export default Byline;
