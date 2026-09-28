# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

- `pnpm dev` - development server
- `pnpm build` / `pnpm start` - production build, which generates the Prisma client first, and serve
- `pnpm lint` - `eslint .` (`next lint` was removed in Next.js 16)
- `pnpm typecheck` - `tsc --noEmit`
- `pnpm test` - Vitest, once (`pnpm test:watch` to watch)
- `pnpm format` / `pnpm format:check` - Prettier over the whole repository
- `pnpm prisma generate` - after install and after any schema change

CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, tests, and build on every pull request.
It needs no secrets: every route is static and the tests mock the database.

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 strict, Tailwind CSS v4, shadcn/ui, MDX content, React Hook Form + Zod, next-themes, Prisma 7 against Neon Postgres, Resend for contact email, Vitest.

## Layout

- `src/app/` - routes and layouts
- `src/components/` - grouped by feature; `ui/` is shadcn/ui, `mdx/` renders MDX, `blog/` is post-only UI
- `src/content/` - MDX for `projects/` and `posts/`
- `src/lib/` - content parsing, db client, rate limiting, utilities, and their `*.test.ts`
- `src/actions/` - server actions
- `src/schemas/` - Zod schemas, including the frontmatter ones
- `src/data/` - site constants, experience, and the tech stack map
- `src/models/` - types, mostly derived from the schemas
- `src/styles/globals.css` - the single Tailwind entry point
- `src/generated/prisma` - generated client; gitignored, and excluded from ESLint and Prettier

`@/*` aliases to `src/*`.

## Content

MDX files with gray-matter frontmatter, read by `src/lib/content.ts`.

- **Frontmatter is parsed, not cast.** `src/schemas/content-schema.ts` validates every file against strict Zod schemas, so a missing field, a misspelled key, an unpadded date, or a tech stack slug with no icon fails the build naming the file and the field.
  The post and project types are derived from those schemas.
- **Readers are memoized per request** with React's `cache()`, so `generateMetadata` and the page share one file read.
  List readers return metadata only, never MDX bodies, since the portfolio list is a client component.
- **Unknown slugs return null** rather than throwing, and the `[slug]` pages turn that into a 404.
  Do not wrap the readers in a try/catch that returns null: a malformed file would then build as a 404 instead of failing.
- **Dates** go through `parseContentDate` (`src/lib/date.ts`), which reads `YYYY-MM-DD` as local midnight.
  `new Date('YYYY-MM-DD')` is UTC and renders the previous day anywhere west of UTC.
- **Tech stack** slugs are the keys of `src/data/tech-stack.ts`, which holds each icon, brand colors, and display label.
- **Topics** become URL slugs through `toTopicSlug` (`src/lib/topics.ts`) and get statically generated pages at `/blog/topics/[topic]`.
- **Featured:** projects flagged `featured` appear on the home page; for posts, the flagged ones do, or the two newest when none are flagged.

Post reading time is derived, never authored: `getReadingTime` (`src/lib/reading-time.ts`) runs inside `getPostBySlug` and scores prose at 220 wpm with fenced code counted separately at 40 lines/min, since counting code as prose badly overstates a code-heavy post.

Posts are compiled with `compileMdx` (`src/components/mdx/mdx-components.tsx`), which also returns the post's `h2`s for the table of contents.
They are collected by a rehype plugin placed directly after rehype-slug, so the ids are the rendered ones; do not re-derive them from the Markdown.

## Styling

Tailwind v4 is configured entirely in CSS - there is no `tailwind.config.ts`.
The theme lives in `@theme inline` in `globals.css`, dark mode is a `@custom-variant` matching the `.dark` class next-themes sets, and `mdx.css` is `@import`ed there rather than from components, because v4 `@apply` needs a shared context.
`color-level-*` helpers are `@utility` rules.

Do not "modernize" `rounded-sm` to `rounded-xs`: the theme overrides `--radius-sm` to 4px, and the rename would silently fall back to the 2px default.

Image `sizes` must describe the rendered width, or next/image serves its largest variant.
Content-width images use `contentImageSizes` from `src/data/site.ts`; `%` is not a valid `sizes` length.

Use `AnimatedLink` with `isExternal` for anything that is not a page of this site, including same-origin files: it renders a plain anchor, because next/link prefetches any same-origin href in view and would download a PDF for every visitor.

## No loading.tsx, on purpose

There is deliberately no root `loading.tsx`.
Every route is Static or SSG and Links prefetch by default, so the RSC payload is already cached by the time a link is clicked - a loading boundary had nothing to fill on a normal navigation (measured: zero fallback renders across a real client-side transition).
What it did do was render the fallback client-side whenever hydration ran slowly, flashing a full-page "Loading" screen mid-article at random.
It also fought `next-view-transitions`, which cross-fades pages: animating into a loading screen and back out looks worse than not animating.

If a genuinely slow route is ever added, give it a scoped `loading.tsx` in that segment rather than reinstating a global one, and prefer a top progress bar over a layout-replacing spinner.

## Post view counts

Views live in the same Postgres database as everything else (`src/lib/views.ts`); a second datastore would buy nothing once comments are also read per page.

- **Fails soft.** Any database error resolves to `null` and `ViewCounter` renders nothing, separator dot included.
  The site builds and runs with no database reachable - which is also the state before the tables exist.
- **Counted client-side.** Posts are static, so `ViewCounter` calls `recordPostViewAction` on mount, guarded by a ref so Strict Mode does not double-count.
  The action validates the slug against `getAllPostSlugs()` because a server action is a public endpoint.
- **Deduped by session, not IP.** An IP is personal data, is shared behind a NAT, and follows people between networks.
  The action mints an opaque id into an httpOnly `pv_session` cookie with no `maxAge`, so it dies with the browser.
- **Dedup is a database constraint.** `PostViewSession` is keyed on `(sessionId, slug)` and the insert uses `skipDuplicates`; whether a row was written decides whether the total increments.
  Catching a unique violation instead would abort the surrounding transaction and leave nothing to read.

`post_view_sessions` is never pruned, but `viewed_at` is indexed so it can be.

Loading a post in `pnpm dev` records a view in whatever database `DATABASE_URL` points at, which locally is production.
To test pages without writing, run the dev server with `DATABASE_URL` pointed at an unreachable host; the counter fails soft.

## Contact form

The action is a public endpoint that sends email, so it has three layers:

- The Zod schema bounds every field.
- A hidden `website` honeypot field; a filled one gets a fake success, since telling a bot it was caught teaches it what to change.
- A rate limit of 3 submissions per 10 minutes per caller (`src/lib/rate-limit.ts`), counted in the `contact_submissions` table so it holds across serverless instances.
  The caller key is a SHA-256 of the IP, never the address, and rows older than a day are pruned.
  If the database is unreachable or the table does not exist yet, it falls back to an in-memory count and logs why, rather than failing the form.

`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` set the addresses.
The default sender is Resend's shared sandbox, which only delivers to the account owner.

## Prisma 7

Older Prisma recipes do not apply here:

- The connection URL is **not** in `schema.prisma` - it is in `prisma.config.ts`, pointed at `DATABASE_URL_UNPOOLED`, because migrations take advisory locks that do not survive a transaction pooler.
  That config resolves `env()` **eagerly**, even for `prisma generate`, which never connects - so a deploy setting only `DATABASE_URL` would fail at the generate step.
  Hence the fallback to `DATABASE_URL`, which keeps production down to one variable.
  Runtime reads only `DATABASE_URL`; `DATABASE_URL_UNPOOLED` is CLI-only.
- The generator is `prisma-client` (not `prisma-client-js`) and requires an explicit `output`.
- **The build runs `prisma generate` itself.** The client is generated into `src/generated/prisma`, which is gitignored, so a fresh clone does not have it.
  `postinstall` also generates, but only on a real install: pnpm 12 skips the install, lifecycle scripts included, when `node_modules` is already current, and a restored Vercel build cache is exactly that.
  Keep the generate in `build`; relying on `postinstall` alone fails every deploy after the first.
- Every database needs a driver adapter; `src/lib/db.ts` uses `PrismaNeon` against the _pooled_ endpoint so serverless cold starts cannot exhaust a TCP pool.
- The schema keeps the Auth.js `User`/`Account` models and the empty `GuestbookNote` even though nothing reads them.
  They are live tables in Neon and `prisma db push` would drop them.

## Package manager

pnpm, pinned by `packageManager` in `package.json`.
pnpm 10 switches to that version on its own, so local installs, CI, and a Vercel build all resolve with the same pnpm.

pnpm 11+ no longer reads the `pnpm` field in `package.json`; its settings live in `pnpm-workspace.yaml`:

- `allowBuilds` (and `onlyBuiltDependencies`, the pnpm 10 spelling) lets only Prisma run install scripts.
- `overrides` lifts two exact pins inside Prisma's CLI (`mysql2`, `deepmerge-ts`) past their advisories.
  Drop each once `prisma` depends on a fixed version itself.
- `peerDependencyRules` accepts ESLint 10 for three plugins that have not declared it yet; see below.

## Security headers

`next.config.mjs` sends `nosniff`, a referrer policy, `frame-ancestors 'none'` with `X-Frame-Options: DENY`, and a permissions policy on every route, and turns off `X-Powered-By`.
HSTS is left to Vercel, which already sends it.
There is no script CSP: Next and next-themes inline scripts, so one would need a per-request nonce, turning every static page dynamic.
Because of `frame-ancestors`, the site cannot be embedded in an iframe, including by itself.

## Brand mark

The icon is the letter **R** from Geist SemiBold knocked out of a squircle, shipped as outlines so nothing depends on font loading.
The path lives in two places that must stay in sync: `src/app/icon.svg` and `R_PATH` in `src/components/logo.tsx`.
`logo.tsx` exports `R_PATH` and `TILE_PATH`, which the per-post OpenGraph cards (`src/app/blog/[slug]/opengraph-image.tsx`) also draw with.
Regenerate by extracting `R` from `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf` with `fontTools`.
Geometry is normalized to a `100x100` box: tile corner radius `24`, glyph ink box `56` tall centered on `(50, 50)`.
`Logo` renders `variant="tile"` and `variant="mark"`, both painting with `currentColor` so they invert with the theme.

Derived assets: `icon.svg`, `favicon.ico`, `apple-icon.png` (180x180, square, no alpha), `opengraph-image.png` (1200x630, needs `metadataBase`), `public/icon-{192,512}.png`, and `public/icon-maskable-512.png` (glyph at `0.40` to survive Android's safe-zone crop).
Two traps when regenerating: knockout letters need more weight than positive ones (hence SemiBold, though headings are Medium), and Pillow drops any ICO frame larger than the base image, so save from the 256px frame with the rest in `append_images`.
Every ICO frame must be RGBA - Turbopack refuses to decode grayscale+alpha.

## Pinned on purpose

- **ESLint 10 ahead of its plugins.** ESLint 9 is out of support, but `eslint-plugin-react`, `-import`, and `-jsx-a11y` (via `eslint-config-next`) have not released ESLint 10 peer ranges.
  `peerDependencyRules` in `pnpm-workspace.yaml` accepts 10 for those three.
  `eslint-plugin-react`'s React version detection calls the removed `context.getFilename()`, so `eslint.config.mjs` sets `settings.react.version` from the installed React.
  Drop both workarounds as the plugins catch up.
- **TypeScript `6.0.3`.** TypeScript 7.0 ships no programmatic JS API, so typescript-eslint cannot load and `pnpm lint` fails.
  (`next build` itself runs on 7.0 as of Next 16.3.)
  Revisit at 7.1; Dependabot ignores TypeScript majors until then.
- **Prisma 7.** Prisma 8 is published under `latest` but is still a release candidate.
- **`images.qualities`** is set explicitly in `next.config.mjs`; Next 16 defaults to `[75]` and project/post images render at `quality={95}`.
