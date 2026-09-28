# Architecture

Last reviewed: 2026-09-28.

## Code map

| Area                                      | Where                                                                                                                                                            |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home page and experience timeline         | `src/app/(home)/page.tsx`, `src/components/experience-list.tsx`, `src/data/experience.ts`                                                                        |
| Portfolio list, search, and project pages | `src/app/portfolio`, `src/components/portfolio`, `src/components/search.tsx`, `src/components/highlighted-text.tsx`                                              |
| Blog, topics, and post-only UI            | `src/app/blog`, `src/components/blog`                                                                                                                            |
| MDX source and rendering                  | `src/content/{projects,posts}`, `src/components/mdx`, `src/styles/mdx.css`                                                                                       |
| Content reading and validation            | `src/lib/content.ts`, `src/schemas/content-schema.ts`, `src/models`, `src/lib/{date,topics,reading-time}.ts`                                                     |
| Tech stack icons and labels               | `src/data/tech-stack.ts`, `src/components/icons/tech-stack-icon.tsx`                                                                                             |
| Site constants, metadata, feeds, and SEO  | `src/data/site.ts`, `src/app/layout.tsx`, `src/app/{sitemap,robots,manifest}.ts`, `src/app/feed.xml/route.ts`, `src/components/json-ld.tsx`                      |
| Post view counter                         | `src/lib/views.ts`, `src/actions/post-actions.ts`, `src/components/blog/view-counter.tsx`                                                                        |
| Contact form                              | `src/app/contact`, `src/components/contact`, `src/actions/contact-actions.ts`, `src/schemas/contact-schema.ts`, `src/lib/rate-limit.ts`, `src/email`             |
| Database                                  | `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`; the generated client is in `src/generated/prisma`, gitignored and excluded from ESLint and Prettier |
| Theme, fonts, and global styles           | `src/styles/globals.css`, `src/assets/fonts.ts`, `src/components/theme-toggle.tsx`                                                                               |
| Logo, icons, and OpenGraph images         | `src/components/logo.tsx`, `src/app/{icon.svg,favicon.ico,apple-icon.png,opengraph-image.png}`, `src/app/blog/[slug]/opengraph-image.tsx`, `public/icon-*.png`   |
| Shared UI primitives                      | `src/components/ui` (shadcn/ui)                                                                                                                                  |
| Headers, build, CI, and dependencies      | `next.config.mjs`, `package.json`, `pnpm-workspace.yaml`, `.github/`                                                                                             |

Tests sit next to the code they cover as `*.test.ts`.

## Content

Projects and posts are MDX files with gray-matter frontmatter in `src/content/`, read by `src/lib/content.ts`.

- **Frontmatter is parsed, not cast.** `src/schemas/content-schema.ts` validates every file against strict Zod schemas, so a missing field, a misspelled key, an unpadded date, or a tech stack slug with no icon fails the build, naming the file and the field.
  The post and project types in `src/models` are derived from those schemas.
- **Unknown slugs return null** rather than throwing, and the `[slug]` pages turn that into a 404.
  Wrapping the readers in a try/catch that returns null would make a malformed file build as a 404 instead of failing.
- **Readers are memoized per request** with React's `cache()`, so `generateMetadata` and the page share one file read.
  List readers return metadata only, never MDX bodies, because the portfolio list is a client component.
- **Only `.mdx` files are content**, so a stray `.DS_Store` cannot break the build.
- **Dates** go through `parseContentDate` (`src/lib/date.ts`), which reads `YYYY-MM-DD` as local midnight.
  `new Date('YYYY-MM-DD')` is UTC and renders the previous day anywhere west of UTC.
- **Tech stack** slugs are the keys of `src/data/tech-stack.ts`, which holds each icon, brand colors, and display label.
- **Topics** become URL slugs through `toTopicSlug` (`src/lib/topics.ts`) and get statically generated pages at `/blog/topics/[topic]`.
- **Featured:** projects flagged `featured` appear on the home page.
  For posts, the flagged ones do, or the two newest when none are flagged, so flagging one post replaces both.

Reading time is derived, never authored.
`getReadingTime` (`src/lib/reading-time.ts`) runs inside `getPostBySlug` and scores prose at 220 wpm and fenced code at 40 lines a minute, since counting code as prose badly overstates a code-heavy post.

Posts are compiled with `compileMdx` (`src/components/mdx/mdx-components.tsx`), which also returns the post's `h2`s for the table of contents.
A rehype plugin placed directly after rehype-slug collects them, so the ids are the rendered ones; do not re-derive them from the Markdown.
The table of contents shows beside posts from `xl` up; the reading progress bar is a CSS scroll-driven animation in `globals.css` with no JavaScript.

## Styling

Tailwind 4 is configured entirely in CSS; there is no `tailwind.config.ts`.
`src/styles/globals.css` is the single entry point:

- The theme lives in `@theme inline`.
- Dark mode is a `@custom-variant` matching the `.dark` class next-themes sets.
- `mdx.css` is `@import`ed there rather than from components, because v4 `@apply` needs a shared context.
- The `color-level-*` helpers are `@utility` rules.

Do not "modernize" `rounded-sm` to `rounded-xs`: the theme overrides `--radius-sm` to 4px, and the rename would silently fall back to the 2px default.

Image `sizes` must describe the rendered width, or next/image serves its largest variant.
Content-width images use `contentImageSizes` from `src/data/site.ts`; `%` is not a valid `sizes` length.
Only the first two portfolio cards and a project's hero image are `priority`.
`images.qualities` is set explicitly in `next.config.mjs`, because Next 16 defaults to `[75]` and project and post images render at `quality={95}`.

## Routing and SEO

Use `AnimatedLink` with `isExternal` for anything that is not a page of this site, including same-origin files.
It renders a plain anchor, because next/link prefetches any same-origin href in view and would download the resume PDF for every visitor.

Pages cross-fade with `next-view-transitions`.

### No loading.tsx, on purpose

There is deliberately no root `loading.tsx`.
Every route is Static or SSG and links prefetch by default, so the RSC payload is already cached when a link is clicked; a loading boundary had nothing to fill on a normal navigation (measured: zero fallback renders across a real client-side transition).
What it did do was render the fallback client-side whenever hydration ran slowly, flashing a full-page "Loading" screen mid-article at random.
It also fought the view transitions: animating into a loading screen and back out looks worse than not animating.

If a genuinely slow route is ever added, give it a scoped `loading.tsx` in that segment, and prefer a top progress bar over a layout-replacing spinner.

### Metadata

`metadataBase` and the site constants come from `src/data/site.ts`.
Every page sets a description, a canonical URL, and OpenGraph tags.
The site also publishes `sitemap.xml` (including topic pages), `robots.txt`, a web manifest, an RSS feed at `/feed.xml`, and JSON-LD: a Person on the home page and a BlogPosting on each post.
Vercel Analytics and Speed Insights load from the root layout.

## Database

Neon Postgres, through Prisma 7.
Older Prisma recipes do not apply:

- The connection URL is **not** in `schema.prisma`; it is in `prisma.config.ts`, pointed at `DATABASE_URL_UNPOOLED`, because migrations take advisory locks that do not survive a transaction pooler.
  That config resolves `env()` eagerly, even for `prisma generate`, which never connects, so a deploy setting only `DATABASE_URL` would fail at the generate step.
  Hence the fallback to `DATABASE_URL`, which keeps production down to one variable.
  Runtime reads only `DATABASE_URL`; `DATABASE_URL_UNPOOLED` is CLI-only.
- The generator is `prisma-client` (not `prisma-client-js`) and requires an explicit `output`.
- Every database needs a driver adapter.
  `src/lib/db.ts` uses `PrismaNeon` against the pooled endpoint, so serverless cold starts cannot exhaust a TCP pool.
- **Database errors are logged through `describeError`** (`src/lib/describe-error.ts`).
  A failed connection rejects with the WebSocket's `ErrorEvent`, not an Error, which logs as a bare `ErrorEvent { type: 'error' }`.
  The driver is given the `ws` package because Node's built-in WebSocket withholds the reason; with `ws`, the log names it, as in `WebSocket error: getaddrinfo ENOTFOUND db.invalid (wss://db.invalid/v2)`.
- **The build runs `prisma generate` itself.** The client is generated into `src/generated/prisma`, which is gitignored, so a fresh clone does not have it.
  `postinstall` also generates, but only on a real install: pnpm 12 skips the install, lifecycle scripts included, when `node_modules` is already current, and a restored Vercel build cache is exactly that.
  Relying on `postinstall` alone fails every deploy after the first; CI deletes the generated client before building to catch it.
- The schema keeps the Auth.js `User` and `Account` models and the empty `GuestbookNote` even though nothing reads them.
  They are live tables in Neon, and `prisma db push` would drop them.
  Whether to build on them or drop them is an [open decision](status.md#open-decisions).

The database is only ever an enhancement: the site builds and runs with no database reachable.
`.env.example` documents every variable.

## Post views

Views live in the same Postgres database as everything else (`src/lib/views.ts`); a second datastore would buy nothing once comments are also read per page.

- **Fails soft.** Any database error resolves to `null`, and `ViewCounter` renders nothing, separator dot included.
  That is also the state before the tables exist.
- **Counted client-side.** Posts are static, so `ViewCounter` calls `recordPostViewAction` on mount, guarded by a ref so Strict Mode does not double-count.
  The action validates the slug against `getAllPostSlugs()` because a server action is a public endpoint.
- **Deduped by session, not IP.** An IP is personal data, is shared behind a NAT, and follows people between networks.
  The action mints an opaque id into an httpOnly `pv_session` cookie with no `maxAge`, so it dies with the browser.
- **Dedup is a database constraint.** `PostViewSession` is keyed on `(sessionId, slug)` and the insert uses `skipDuplicates`; whether a row was written decides whether the total increments.
  Catching a unique violation instead would abort the surrounding transaction and leave nothing to read.

Sessions are kept for 30 days.
Each newly counted view deletes older ones, through the `viewed_at` index, so the table stops growing without a cron; a session that returns after a month counts once more.

Loading a post in `pnpm dev` records a view in whatever database `DATABASE_URL` points at, which locally is production.
To test pages without writing, run the dev server with `DATABASE_URL` pointed at an unreachable host; the counter fails soft.

## Contact form

The action is a public endpoint that sends email, so it has three layers:

- The Zod schema bounds every field.
- A hidden `website` honeypot field; a filled one gets a fake success, since telling a bot it was caught teaches it what to change.
- A rate limit of 3 submissions per 10 minutes per caller (`src/lib/rate-limit.ts`), counted in the `contact_submissions` table so it holds across serverless instances.
  The caller key is a SHA-256 of the IP, never the address, and rows older than a day are pruned.
  If the database is unreachable or the table does not exist, it falls back to an in-memory count and logs why, rather than failing the form.

Email goes through Resend.
`CONTACT_FROM_EMAIL` and `CONTACT_TO_EMAIL` set the addresses.
The default sender is Resend's shared sandbox, which only delivers to the account owner.

## Security headers

`next.config.mjs` sends `nosniff`, a referrer policy, `frame-ancestors 'none'` with `X-Frame-Options: DENY`, and a permissions policy on every route, and turns off `X-Powered-By`.
Because of `frame-ancestors`, the site cannot be embedded in an iframe, including by itself.

- **HSTS** is left to Vercel, which already sends it.
  Adding `includeSubDomains` or `preload` would commit every subdomain to HTTPS.
- **No script CSP.** Next and next-themes inline scripts, so a CSP would need a per-request nonce, turning every static page dynamic.

## Brand mark

The icon is the letter **R** from Geist SemiBold knocked out of a squircle, shipped as outlines so nothing depends on font loading.

- The path lives in two places that must stay in sync: `src/app/icon.svg` and `R_PATH` in `src/components/logo.tsx`.
- `logo.tsx` exports `R_PATH` and `TILE_PATH`, which the per-post OpenGraph cards (`src/app/blog/[slug]/opengraph-image.tsx`) also draw with.
- `Logo` renders `variant="tile"` and `variant="mark"`, both painting with `currentColor` so they invert with the theme.
- Geometry is normalized to a `100x100` box: tile corner radius `24`, glyph ink box `56` tall, centered on `(50, 50)`.

Regenerate by extracting `R` from `node_modules/geist/dist/fonts/geist-sans/Geist-SemiBold.ttf` with `fontTools`.
Derived assets: `icon.svg`, `favicon.ico`, `apple-icon.png` (180x180, square, no alpha), `opengraph-image.png` (1200x630, needs `metadataBase`), `public/icon-{192,512}.png`, and `public/icon-maskable-512.png` (glyph at `0.40` to survive Android's safe-zone crop).

Traps when regenerating:

- Knockout letters need more weight than positive ones, hence SemiBold even though headings are Medium.
- Pillow drops any ICO frame larger than the base image, so save from the 256px frame with the rest in `append_images`.
- Every ICO frame must be RGBA; Turbopack refuses to decode grayscale with alpha.

## Tooling and deploy

Vercel deploys `main` and builds a preview for every pull request.
CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, tests, and build on every pull request and push to `main`, from a clean install with no secrets.
Dependabot opens dependency updates.

pnpm is pinned by `packageManager` in `package.json`, and pnpm 10 and later switch to that version on their own, so local installs, CI, and Vercel resolve with the same pnpm.
pnpm 11 and later no longer read the `pnpm` field in `package.json`; the settings live in `pnpm-workspace.yaml`:

- `allowBuilds` (and `onlyBuiltDependencies`, the pnpm 10 spelling) lets only Prisma run install scripts.
- `overrides` lifts two exact pins inside Prisma's CLI (`mysql2`, `deepmerge-ts`) past their advisories.
  Drop each once `prisma` depends on a fixed version itself.
- `peerDependencyRules` accepts ESLint 10 for three plugins that have not declared it yet; see below.

### Pinned versions

- **ESLint 10 ahead of its plugins.** ESLint 9 is out of support, but `eslint-plugin-react`, `-import`, and `-jsx-a11y` (via `eslint-config-next`) have not released ESLint 10 peer ranges.
  `peerDependencyRules` accepts 10 for those three.
  `eslint-plugin-react`'s React version detection calls the removed `context.getFilename()`, so `eslint.config.mjs` sets `settings.react.version` from the installed React.
  Drop both workarounds as the plugins catch up.
- **TypeScript 6.0.3.** TypeScript 7.0 ships no programmatic JS API, so typescript-eslint cannot load and `pnpm lint` fails, even though `next build` itself runs on 7.0.
  Revisit at 7.1; Dependabot ignores TypeScript majors until then.
- **Prisma 7.** Prisma 8 is published under `latest` but is still a release candidate.

`tests/upstream-pins.test.ts` reads the installed packages and fails, naming what to remove, once a dependency update makes the ESLint, Prisma override, or TypeScript workaround unnecessary.
Dependabot's updates are what trip it.
