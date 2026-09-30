import React from 'react';
import { format } from 'date-fns';

import Byline from '@/components/byline';
import Callout from '@/components/callout';
import { parseContentDate } from '@/lib/date';

type PostHeaderProps = {
  title: string;
  author: string;
  publishedDate: string;
  readingTime: number;
  summary: string;
  /** Left out of the admin preview, which must not count views */
  viewCounter?: React.ReactNode;
};

/**
 * The top of a post: title, byline, and summary. Shared by the post page and
 * the admin editor's preview, so the preview cannot drift from the page.
 */
const PostHeader = ({
  title,
  author,
  publishedDate,
  readingTime,
  summary,
  viewCounter,
}: PostHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>

      <section className="space-y-3 text-sm md:flex md:items-center md:justify-between md:space-y-0">
        <Byline author={author}>
          Published on {format(parseContentDate(publishedDate), 'MMM dd, yyyy')}
        </Byline>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span>{readingTime} min read</span>
          {viewCounter}
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
