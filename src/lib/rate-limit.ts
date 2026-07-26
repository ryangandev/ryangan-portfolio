import { headers } from 'next/headers';

/**
 * Best-effort flood control for the contact form.
 *
 * Deliberately in-memory: this is a speed bump, not a guarantee. Serverless
 * instances do not share memory and are recycled, so a determined caller
 * spread across enough cold starts gets through. What it does stop is the
 * common case — one source hammering the endpoint in a loop, which is what
 * an unauthenticated action that sends email actually attracts. A durable
 * limit belongs at the platform edge or in Postgres; see docs/.
 *
 * The caller's IP is read per request and never stored or logged. It lives
 * only as a map key for the length of the window, which is the narrowest use
 * that still works.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

const hits = new Map<string, number[]>();

const getClientIp = async (): Promise<string> => {
  const headerList = await headers();

  // `x-forwarded-for` is a comma-separated chain; the client is the first hop.
  const forwarded = headerList.get('x-forwarded-for')?.split(',')[0]?.trim();

  return forwarded || headerList.get('x-real-ip') || 'unknown';
};

/**
 * The sliding window itself, split out from the request plumbing so it can be
 * exercised without a request.
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
 * Record an attempt from the current request and report whether it is allowed
 * @returns true if the caller is under the limit, false if it should be dropped
 */
export const allowContactSubmission = async (): Promise<boolean> =>
  recordAttempt(await getClientIp(), Date.now());
