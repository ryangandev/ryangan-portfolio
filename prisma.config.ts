import fs from 'node:fs';
import { defineConfig, env } from 'prisma/config';

// Next loads `.env` for the app; the Prisma CLI does not. CI and Vercel set
// their variables directly and have no file, and a variable already set wins.
if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

/**
 * Prisma 7 moved the connection URL out of `schema.prisma` and into this file.
 *
 * The CLI wants Neon's *direct* (unpooled) endpoint: migrations take advisory
 * locks and inspect the catalog, neither of which survives a transaction
 * pooler. The app itself uses the pooled URL at runtime, wired up separately in
 * `src/lib/db.ts`.
 *
 * The fallback matters more than it looks. Prisma resolves this eagerly when
 * the config loads - even for `prisma generate`, which never opens a
 * connection - so without it a deploy that only sets `DATABASE_URL` fails at
 * the generate step rather than at any query. Falling back keeps production
 * down to a single environment variable.
 *
 * Set `DATABASE_URL_UNPOOLED` wherever you actually run `db push` or `migrate`.
 * Those commands can hang or fail in confusing ways against the pooled endpoint.
 */
const directUrl = process.env.DATABASE_URL_UNPOOLED
  ? env('DATABASE_URL_UNPOOLED')
  : env('DATABASE_URL');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: directUrl,
  },
});
