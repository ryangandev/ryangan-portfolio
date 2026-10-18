import { toNextJsHandler } from 'better-auth/next-js';

import { getAuth } from '@/auth';

/**
 * Where GitHub sends the browser back to finish a sign-in. It is the one
 * Better Auth endpoint served over HTTP: the server starts sign-ins, reads
 * sessions, and signs out through `getAuth().api`, so the endpoints that would let
 * a browser change its user, link another account, or read the GitHub token
 * are not reachable at all.
 */
export const { GET } = toNextJsHandler((request) => getAuth().handler(request));
