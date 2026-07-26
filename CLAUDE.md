# CLAUDE.md

Guidance for Claude Code (claude.ai/code) when working in this repository.

## Commands

- `pnpm dev` — development server
- `pnpm build` / `pnpm start` — production build and serve
- `pnpm lint` — `eslint .` (`next lint` was removed in Next.js 16)
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm prisma generate` — after install and after any schema change

## Stack

Next.js 16 (App Router, Turbopack), React 19, TypeScript 6 strict, Tailwind CSS v4,
shadcn/ui, MDX content, Framer Motion, React Hook Form + Zod, next-themes,
Prisma 7 against Neon Postgres, Resend for contact email.

## Layout

- `src/app/` — routes and layouts
- `src/components/` — grouped by feature; `ui/` is shadcn/ui, `mdx/` renders MDX
- `src/content/` — MDX for `projects/` and `posts/`
- `src/lib/` — content parsing, db client, utilities
- `src/actions/` — server actions
- `src/models/`, `src/schemas/`, `src/data/`, `src/providers/`, `src/hooks/`
- `src/styles/globals.css` — the single Tailwind entry point
- `src/generated/prisma` — generated client; gitignored, and excluded from ESLint and Prettier

`@/*` aliases to `src/*`.

## Content

MDX files with gray-matter frontmatter, parsed by `src/lib/content.ts`. Projects
support a `featured` flag for the homepage. Post reading time is derived, never
authored: `getReadingTime` (`src/lib/reading-time.ts`) runs inside `getPostBySlug`
and scores prose at 220 wpm with fenced code counted separately at 40 lines/min,
since counting code as prose badly overstates a code-heavy post.

## Styling

Tailwind v4 is configured entirely in CSS — there is no `tailwind.config.ts`. The
theme lives in `@theme inline` in `globals.css`, dark mode is a `@custom-variant`
matching the `.dark` class next-themes sets, and `mdx.css` is `@import`ed there
rather than from components, because v4 `@apply` needs a shared context.
`color-level-*` helpers are `@utility` rules.

Do not "modernize" `rounded-sm` to `rounded-xs`: the theme overrides `--radius-sm`
to 4px, and the rename would silently fall back to the 2px default.

## No loading.tsx, on purpose

There is deliberately no root `loading.tsx`. Every route is Static or SSG and
Links prefetch by default, so the RSC payload is already cached by the time a
link is clicked — a loading boundary had nothing to fill on a normal navigation
(measured: zero fallback renders across a real client-side transition). What it
did do was render the fallback client-side whenever hydration ran slowly,
flashing a full-page "Loading" screen mid-article at random. It also fought
`next-view-transitions`, which cross-fades pages: animating into a loading
screen and back out looks worse than not animating.

If a genuinely slow route is ever added, give it a scoped `loading.tsx` in that
segment rather than reinstating a global one, and prefer a top progress bar over
a layout-replacing spinner.

## Post view counts

Views live in the same Postgres database as everything else (`src/lib/views.ts`);
a second datastore would buy nothing once comments are also read per page.

- **Fails soft.** Any database error resolves to `null` and `ViewCounter` renders
  nothing, separator dot included. The site builds and runs with no database
  reachable — which is also the state before the tables exist.
- **Counted client-side.** Posts are static, so `ViewCounter` calls
  `recordPostViewAction` on mount, guarded by a ref so Strict Mode does not
  double-count. The action validates the slug against `getAllPostSlugs()` because
  a server action is a public endpoint.
- **Deduped by session, not IP.** An IP is personal data, is shared behind a NAT,
  and follows people between networks. The action mints an opaque id into an
  httpOnly `pv_session` cookie with no `maxAge`, so it dies with the browser.
- **Dedup is a database constraint.** `PostViewSession` is keyed on
  `(sessionId, slug)` and the insert uses `skipDuplicates`; whether a row was
  written decides whether the total increments. Catching a unique violation
  instead would abort the surrounding transaction and leave nothing to read.

`post_view_sessions` is never pruned, but `viewed_at` is indexed so it can be.

## Prisma 7

Older Prisma recipes do not apply here:

- The connection URL is **not** in `schema.prisma` — it is in `prisma.config.ts`,
  pointed at `DATABASE_URL_UNPOOLED`, because migrations take advisory locks that
  do not survive a transaction pooler.
- The generator is `prisma-client` (not `prisma-client-js`) and requires an
  explicit `output`.
- Every database needs a driver adapter; `src/lib/db.ts` uses `PrismaNeon` against
  the *pooled* endpoint so serverless cold starts cannot exhaust a TCP pool.
- The schema keeps the Auth.js `User`/`Account` models and the empty
  `GuestbookNote` even though nothing reads them. They are live tables in Neon and
  `prisma db push` would drop them.

## Brand mark

The icon is the letter **R** from Geist SemiBold knocked out of a squircle, shipped
as outlines so nothing depends on font loading. The path lives in two places that
must stay in sync: `src/app/icon.svg` and `R_PATH` in `src/components/logo.tsx`.
Regenerate by extracting `R` from `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf`
with `fontTools`. Geometry is normalised to a `100x100` box: tile corner radius
`24`, glyph ink box `56` tall centred on `(50, 50)`. `Logo` renders `variant="tile"`
and `variant="mark"`, both painting with `currentColor` so they invert with the theme.

Derived assets: `icon.svg`, `favicon.ico`, `apple-icon.png` (180x180, square, no
alpha), `opengraph-image.png` (1200x630, needs `metadataBase`),
`public/icon-{192,512}.png`, and `public/icon-maskable-512.png` (glyph at `0.40`
to survive Android's safe-zone crop). Two traps when regenerating: knockout letters
need more weight than positive ones (hence SemiBold, though headings are Medium),
and Pillow drops any ICO frame larger than the base image, so save from the 256px
frame with the rest in `append_images`. Every ICO frame must be RGBA — Turbopack
refuses to decode grayscale+alpha.

## Pinned on purpose

- **ESLint `9.39.5`.** ESLint 10 removes `context.getFilename()`, which
  `eslint-plugin-react` (via `eslint-config-next`) still calls, hard-crashing lint.
- **TypeScript `6.0.3`.** TypeScript 7 ships no programmatic JS API until 7.1,
  breaking both `next build` and typescript-eslint.
- **`images.qualities`** is set explicitly in `next.config.mjs`; Next 16 defaults
  to `[75]` and project/post images render at `quality={95}`.

## Dead code

`site-header.tsx`, `menubar.tsx`, `navigation/main-nav.tsx`,
`navigation/mobile-main-nav.tsx` and `ui/dropdown-menu.tsx` are unreachable —
nothing renders `SiteHeader`. Delete them if the header is not coming back.
