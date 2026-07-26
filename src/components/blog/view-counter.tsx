'use client';

import React, { useEffect, useRef, useState } from 'react';

import { recordPostViewAction } from '@/actions/post-actions';

type ViewCounterProps = {
  slug: string;
};

/**
 * Records a view on mount and renders the running total.
 *
 * Posts are statically generated, so the count has to be fetched from the
 * client. Nothing is rendered until a number comes back — and nothing at all
 * when view tracking is unconfigured — which keeps the metadata row from
 * reserving space for a count that may never arrive.
 */
const ViewCounter: React.FC<ViewCounterProps> = ({ slug }) => {
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

  if (views === null) {
    return null;
  }

  return (
    <>
      <span aria-hidden>&middot;</span>
      <span>
        {views.toLocaleString()} view{views === 1 ? '' : 's'}
      </span>
    </>
  );
};

export default ViewCounter;
