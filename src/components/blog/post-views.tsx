'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { recordPostViewAction } from '@/actions/post-actions';

/**
 * A small count reads as nobody reading, so it stays hidden until it is worth
 * showing. Views are still recorded from the first one.
 */
const MIN_VIEWS_SHOWN = 100;

const PostViewsContext = createContext<number | null>(null);

type PostViewsProps = {
  slug: string;
  children: React.ReactNode;
};

/**
 * Records one view of the post on mount and shares the running total with
 * every `PostViewCount` inside it.
 *
 * Posts are statically generated, so the count has to be fetched from the
 * client. The count shows in two places, under the title and in the right-hand
 * gutter, and recording it from each would count a first visit twice: the two
 * requests would race, each minting its own session cookie.
 */
export const PostViews = ({ slug, children }: PostViewsProps) => {
  const [views, setViews] = useState<number | null>(null);
  const recorded = useRef(false);

  useEffect(() => {
    // Strict Mode runs effects twice in development, which would otherwise
    // count the first view of a session twice.
    if (recorded.current) {
      return;
    }
    recorded.current = true;

    recordPostViewAction(slug)
      .then(setViews)
      .catch(() => setViews(null));
  }, [slug]);

  return <PostViewsContext value={views}>{children}</PostViewsContext>;
};

type PostViewCountProps = {
  /**
   * `inline` follows the reading time under the title; `gutter` is a labelled
   * row of the facts in the right-hand gutter.
   */
  placement: 'inline' | 'gutter';
};

/**
 * The post's view total, once it reaches `MIN_VIEWS_SHOWN`. Nothing renders
 * until a number comes back, and nothing at all when view tracking is
 * unconfigured or outside `PostViews`, as in the admin preview, so no space is
 * held for a count that may never arrive.
 */
export const PostViewCount = ({ placement }: PostViewCountProps) => {
  const views = useContext(PostViewsContext);

  if (views === null || views < MIN_VIEWS_SHOWN) {
    return null;
  }

  const total = views.toLocaleString();

  if (placement === 'gutter') {
    return (
      <div>
        <dt className="color-level-5">Views</dt>
        <dd className="color-level-2">{total}</dd>
      </div>
    );
  }

  return (
    <>
      <span aria-hidden>&middot;</span>
      <span>{total} views</span>
    </>
  );
};
