'use server';

import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

import { getAllPostSlugs } from '@/lib/content';
import { recordPostView } from '@/lib/views';

const SESSION_COOKIE = 'pv_session';

/**
 * Identify the current browser session, minting an id the first time.
 *
 * Deliberately not the visitor's IP address: an IP is personal data, is shared
 * by everyone behind a NAT, and follows people between networks, so it manages
 * to both over- and under-count. This id is a random opaque value tied to
 * nothing else.
 *
 * No `maxAge`, so it is a true session cookie — it dies when the browser
 * closes, and reopening the site counts as a fresh visit.
 */
const getSessionId = async (): Promise<string> => {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;

  if (existing) {
    return existing;
  }

  const sessionId = randomUUID();

  jar.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return sessionId;
};

/**
 * Count one view of a post
 * @param slug the post being viewed
 * @returns The post's view total, or null if the slug is unknown or the
 *          database could not be reached
 */
export const recordPostViewAction = async (
  slug: string,
): Promise<number | null> => {
  // A server action is a public endpoint, so only slugs that map to a real
  // post are counted. Otherwise arbitrary callers could fill the table with
  // rows that no page will ever read.
  const slugs = await getAllPostSlugs();

  if (!slugs.includes(slug)) {
    return null;
  }

  return recordPostView(slug, await getSessionId());
};
