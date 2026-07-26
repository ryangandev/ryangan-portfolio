import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

/**
 * Prisma 7 moved the connection URL out of `schema.prisma` and into this file.
 *
 * The CLI is pointed at Neon's *direct* (unpooled) endpoint: migrations take
 * advisory locks and inspect the catalog, neither of which survives a
 * transaction pooler. The pooled URL is the one the app itself uses at runtime,
 * wired up in `src/lib/db.ts`.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL_UNPOOLED'),
  },
});
