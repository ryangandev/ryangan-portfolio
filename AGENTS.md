# Ryan Gan's portfolio

The personal site at https://ryangan.me: a home page, project case studies, and an MDX blog.
Next.js 16 App Router, React 19, TypeScript 6, Tailwind CSS 4, Prisma 7 on Neon Postgres, Resend, Vitest, deployed on Vercel.

## Start here

1. Check the branch, working tree, and recent commits.
2. Read [docs/README.md](docs/README.md) to route the request, then read only the section it points to.
3. Read the code that section names before changing it.

Do not read every doc by default.

## Commands

- `pnpm dev` - development server
- `pnpm build` - generates the Prisma client, then builds
- `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` - what CI runs on every pull request, along with the build
- `pnpm format` - Prettier over the whole repository
- `pnpm prisma generate` - after install and after any schema change

`@/*` aliases to `src/*`.
CI needs no secrets: every route is static and the tests mock the database.

## Rules that fail silently when broken

- Never wrap the content readers in a try/catch that returns null; a malformed file would build as a 404 instead of failing. See [Content](docs/architecture.md#content).
- Parse frontmatter dates with `parseContentDate`, never `new Date('YYYY-MM-DD')`. See [Content](docs/architecture.md#content).
- Do not rename `rounded-sm` to `rounded-xs`. See [Styling](docs/architecture.md#styling).
- Image `sizes` must describe the rendered width. See [Styling](docs/architecture.md#styling).
- Link anything that is not a page of this site, same-origin files included, with `AnimatedLink isExternal`. See [Routing and SEO](docs/architecture.md#routing-and-seo).
- Do not add a root `loading.tsx`. See [Routing and SEO](docs/architecture.md#routing-and-seo).
- Keep `prisma generate` in the `build` script. See [Database](docs/architecture.md#database).
- Do not remove the unused Auth.js and guestbook models from the schema; they are live tables. See [Database](docs/architecture.md#database).
- `pnpm dev` writes view counts to whatever database `DATABASE_URL` points at, which locally is production. See [Post views](docs/architecture.md#post-views).
- Keep `src/app/icon.svg` and `R_PATH` in `src/components/logo.tsx` in sync. See [Brand mark](docs/architecture.md#brand-mark).
- Check [Pinned versions](docs/architecture.md#pinned-versions) before upgrading TypeScript, Prisma, or ESLint.

## Keeping docs current

Update the doc that owns a fact in the same commit that changes it.
Ownership rules are in [docs/README.md](docs/README.md).
