import { createHash } from 'node:crypto';
import { headers } from 'next/headers';

import { db } from '@/lib/db';

/**
 * Flood control for the contact form: at most `MAX_PER_WINDOW` submissions per
 * caller in any `WINDOW_MS`.
 *
 * The count lives in Postgres (`contact_submissions`) so it holds across
 * serverless instances. An in-memory count was a speed bump only, since each
 * instance kept its own and a caller spread across cold starts got through.
 *
 * If the database cannot be reached, or the table has not been created yet,
 * this falls back to the in-memory count rather than failing the form: a
 * contact form that rejects everyone during a database blip is worse than one
 * rate limited per instance.
 *
 * Callers are identified by a SHA-256 of their IP. The address itself is
 * never stored or logged, and stored keys are deleted after a day.
 */
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 3;
const RETENTION_MS = 24 * 60 * 60_000;

const getClientKey = async (): Promise<string> => {
  const headerList = await headers();

  // `x-forwarded-for` is a comma-separated chain; the client is the first hop.
  // On Vercel both headers are set by the edge, not passed through from the
  // client.
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip') ||
    'unknown';

  return createHash('sha256').update(ip).digest('hex');
};

const hits = new Map<string, number[]>();

/**
 * The in-memory sliding window, used when the database is unavailable
 *
 * @param key whatever identifies the caller
 * @param now current time in milliseconds
 * @returns true if the caller is under the limit, false if it should be dropped
 */
export const recordAttempt = (key: string, now: number): boolean => {
  const recent = (hits.get(key) ?? []).filter((at) => now - at < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);

  // Drop keys whose windows have fully expired, so a long-lived instance does
  // not accumulate an entry per visitor forever.
  for (const [other, timestamps] of hits) {
    if (timestamps.every((at) => now - at >= WINDOW_MS)) {
      hits.delete(other);
    }
  }

  return true;
};

/**
 * The durable sliding window
 *
 * Inserts first and counts second. Two concurrent requests then each see the
 * other's row once both commit, rather than both reading a count of two and
 * both getting through. It also means rejected attempts are recorded, so a
 * caller that keeps hammering stays blocked until it stops for a full window.
 *
 * @param key hashed caller identity
 * @param now current time in milliseconds
 * @returns true if the caller is under the limit, false if it should be dropped
 * @throws when the database is unreachable or the table does not exist
 */
export const recordDurableAttempt = async (
  key: string,
  now: number,
): Promise<boolean> => {
  await db.contactSubmission.create({
    data: { clientKey: key, submittedAt: new Date(now) },
  });

  const [recent] = await Promise.all([
    db.contactSubmission.count({
      where: { clientKey: key, submittedAt: { gt: new Date(now - WINDOW_MS) } },
    }),
    db.contactSubmission.deleteMany({
      where: { submittedAt: { lt: new Date(now - RETENTION_MS) } },
    }),
  ]);

  return recent <= MAX_PER_WINDOW;
};

/**
 * Record an attempt from the current request and report whether it is allowed
 * @returns true if the caller is under the limit, false if it should be dropped
 */
export const allowContactSubmission = async (): Promise<boolean> => {
  const key = await getClientKey();
  const now = Date.now();

  try {
    return await recordDurableAttempt(key, now);
  } catch (error) {
    console.error('Contact rate limit store error, using memory: ', error);
    return recordAttempt(key, now);
  }
};
