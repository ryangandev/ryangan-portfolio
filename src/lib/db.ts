import { PrismaNeon } from '@prisma/adapter-neon';

import { PrismaClient } from '@/generated/prisma/client';

/**
 * Shared Prisma client.
 *
 * Prisma 7 no longer opens connections itself — every database needs a driver
 * adapter. `PrismaNeon` talks to Neon over its serverless driver rather than a
 * raw TCP socket, which is what makes it safe to call from Vercel functions:
 * there is no long-lived connection pool for a burst of cold starts to exhaust.
 *
 * It is handed the *pooled* endpoint (the `-pooler` host). The Prisma CLI uses
 * the direct one instead, wired up in `prisma.config.ts`.
 */
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
  });

// Hot reload re-evaluates modules on every edit, so without stashing the client
// on globalThis each save would leak another one.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
