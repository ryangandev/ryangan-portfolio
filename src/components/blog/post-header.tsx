import React from 'react';
import { format } from 'date-fns';

import { PostViewCount } from '@/components/blog/post-views';
import Byline from '@/components/byline';
import Callout from '@/components/callout';
import { parseContentDate } from '@/lib/date';
import { cn } from '@/lib/utils';

type PostHeaderProps = {
  title: string;
  author: string;
  publishedDate: string;
  readingTime: number;
  summary: string;
  /**
   * The page shows the date, reading time, and views in the right-hand gutter
   * from xl up, so here the byline stops at xl. The admin preview has no
   * gutter and keeps it.
   */
  factsInGutter: boolean;
};

/**
 * The top of a post: title, the byline below xl, and summary. Shared by the
 * post page and the admin editor's preview, so the preview cannot drift from
 * the page. The view count shows only inside `PostViews`, which the preview
 * leaves out so that editing never counts a view.
 */
const PostHeader = ({
  title,
  author,
  publishedDate,
  readingTime,
  summary,
  factsInGutter,
}: PostHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>

      <section
        className={cn(
          'space-y-3 text-sm md:flex md:items-center md:justify-between md:space-y-0',
          factsInGutter && 'xl:hidden',
        )}
      >
        <Byline author={author}>
          Published on {format(parseContentDate(publishedDate), 'MMM dd, yyyy')}
        </Byline>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>{readingTime} min read</span>
          <PostViewCount placement="inline" />
        </div>
      </section>
      {summary && (
        <Callout>
          <p className="mb-0 font-medium italic">{summary}</p>
        </Callout>
      )}
    </>
  );
};

export default PostHeader;
