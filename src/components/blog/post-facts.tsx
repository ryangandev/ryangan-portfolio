import React from 'react';
import { format } from 'date-fns';

import { PostViewCount } from '@/components/blog/post-views';
import TopicList from '@/components/blog/topic-list';
import { parseContentDate } from '@/lib/date';

type PostFactsProps = {
  publishedDate: string;
  readingTime: number;
  topics: string[];
};

/**
 * A post's publish date, reading time, views, and topics, for the left-hand
 * gutter from xl up, under the back link. Below xl the post header's byline carries the first three
 * instead, and the topics follow the post.
 */
const PostFacts = ({ publishedDate, readingTime, topics }: PostFactsProps) => (
  <dl className="mb-0 space-y-3.5 text-sm leading-[22px]">
    <div>
      <dt className="color-level-5">Published</dt>
      <dd className="color-level-2">
        {format(parseContentDate(publishedDate), 'MMM d, yyyy')}
      </dd>
    </div>
    <div>
      <dt className="color-level-5">Reading time</dt>
      <dd className="color-level-2">{readingTime} min</dd>
    </div>
    <PostViewCount placement="gutter" />
    {topics.length > 0 && (
      <div>
        <dt className="color-level-5">Topics</dt>
        <dd className="mt-1.5">
          <TopicList topics={topics} />
        </dd>
      </div>
    )}
  </dl>
);

export default PostFacts;
