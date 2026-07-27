import { db } from '@/lib/db';

/**
 * Post view counts, stored in Postgres alongside everything else rather than in
 * a separate key-value store. Comments will be read on every post page anyway,
 * so the database is already on the critical path — a second datastore would
 * buy nothing.
 *
 * Reads and writes here fail soft: any error resolves to `null` and the UI
 * leaves the count out entirely. A view counter is never worth breaking a page
 * over.
 */

/**
 * Read a post's view count without changing it
 */
export const getPostViews = async (slug: string): Promise<number | null> => {
  try {
    const post = await db.postView.findUnique({ where: { slug } });

    return post?.count ?? 0;
  } catch (error) {
    console.error('Post view read error: ', error);
    return null;
  }
};

/**
 * Count a view of a post, unless this session already viewed it
 * @param slug the post being viewed
 * @param sessionId opaque id identifying the browser session
 * @returns The post's view total — unchanged if this session had already been
 *          counted — or null if the database could not be reached
 */
export const recordPostView = async (
  slug: string,
  sessionId: string,
): Promise<number | null> => {
  try {
    // `skipDuplicates` compiles to `ON CONFLICT DO NOTHING`, so a repeat view
    // is a no-op rather than a thrown unique violation. That matters: in
    // Postgres a failed statement aborts the surrounding transaction, so
    // catching the violation instead would leave nothing usable to read from.
    const { count: inserted } = await db.postViewSession.createMany({
      data: [{ sessionId, slug }],
      skipDuplicates: true,
    });

    // Nothing written means this session is already counted for this post.
    if (inserted === 0) {
      return getPostViews(slug);
    }

    const post = await db.postView.upsert({
      where: { slug },
      create: { slug, count: 1 },
      update: { count: { increment: 1 } },
    });

    return post.count;
  } catch (error) {
    console.error('Post view write error: ', error);
    return null;
  }
};
