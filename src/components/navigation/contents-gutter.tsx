import React from 'react';

import type { MdxHeading } from '@/components/mdx/mdx-components';
import TableOfContents from '@/components/table-of-contents';

/**
 * A post's or a project's table of contents, in the right-hand gutter from xl
 * up, level with the title and the back link across the column. It sticks
 * there while the page scrolls, so the gutter spans the page's height. Below
 * xl there is no gutter, and no table of contents.
 *
 * Back to top shows under it, its top 84px above the bottom of the window,
 * so the list stops 24px short of that: sticking 128px down, it is at most
 * the window's height less 240px, and scrolls on its own past that rather than
 * running under the link.
 */
const ContentsGutter = ({ headings }: { headings: MdxHeading[] }) => (
  <aside className="absolute inset-y-0 left-full hidden xl:block">
    <div className="sticky top-32 ml-10 max-h-[calc(100dvh-15rem)] w-48 gutter-scroll">
      <TableOfContents headings={headings} />
    </div>
  </aside>
);

export default ContentsGutter;
