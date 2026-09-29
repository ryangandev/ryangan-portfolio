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
| Admin portal                              | `src/app/admin`, `src/components/admin`, `src/actions/admin-actions.ts`, `src/lib/admin`, `src/schemas/admin-content-schema.ts`, `src/lib/collections.ts`        |
| Sign-in                                   | `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/types/next-auth.d.ts`                                                                             |
| Database                                  | `prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`; the generated client is in `src/generated/prisma`, gitignored and excluded from ESLint and Prettier |
| Theme, fonts, and global styles           | `src/styles/globals.css`, `src/assets/fonts.ts`, `src/components/theme-toggle.tsx`                                                                               |
| Logo, icons, and OpenGraph images         | `src/components/logo.tsx`, `src/app/{icon.svg,favicon.ico,apple-icon.png,opengraph-image.png}`, `src/app/blog/[slug]/opengraph-image.tsx`, `public/icon-*.png`   |
| Shared UI primitives                      | `src/components/ui` (shadcn/ui)                                                                                                                                  |
| Headers, build, CI, and dependencies      | `next.config.mjs`, `package.json`, `pnpm-workspace.yaml`, `.github/`                                                                                             |

Unit tests sit next to the code they cover as `*.test.ts`; see [Tests](#tests) for the rest.

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
- **Thumbnails** must be `https://ik.imagekit.io` URLs, the one host `images.remotePatterns` in `next.config.mjs` allows; next/image refuses any other.
- **Topics** become URL slugs through `toTopicSlug` (`src/lib/topics.ts`) and get statically generated pages at `/blog/topics/[topic]`.
- **Featured:** projects flagged `featured` appear on the home page.
  For posts, the flagged ones do, or the two newest when none are flagged, so flagging one post replaces both.

Reading time is derived, never authored.
`getReadingTime` (`src/lib/reading-time.ts`) runs inside `getPostBySlug` and scores prose at 220 wpm and fenced code at 40 lines a minute, since counting code as prose badly overstates a code-heavy post.

The [admin portal](#admin-portal) writes these same files, through GitHub.
`src/lib/collections.ts` names the two directories for it; `src/lib/content.ts` spells them out again, because the bundler only scopes file tracing to paths it can read statically, and otherwise ships the whole project with every server function.

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
Every public route is Static or SSG and links prefetch by default, so the RSC payload is already cached when a link is clicked; a loading boundary had nothing to fill on a normal navigation (measured: zero fallback renders across a real client-side transition).
What it did do was render the fallback client-side whenever hydration ran slowly, flashing a full-page "Loading" screen mid-article at random.
It also fought the view transitions: animating into a loading screen and back out looks worse than not animating.

If a genuinely slow route is ever added, give it a scoped `loading.tsx` in that segment, and prefer a top progress bar over a layout-replacing spinner.
The admin pages are the one case: they wait on GitHub, so `src/app/admin/loading.tsx` shows a bar across the top.
Because they stream, an admin URL that does not exist answers 200 with the not-found page, the status having gone out before the page decides; behind sign-in and `noindex`, that costs nothing.

### Metadata

`metadataBase` and the site constants come from `src/data/site.ts`.
Every page sets a description, a canonical URL, and OpenGraph tags.
The site also publishes `sitemap.xml` (including topic pages), `robots.txt`, a web manifest, an RSS feed at `/feed.xml`, and JSON-LD: a Person on the home page and a BlogPosting on each post.
Vercel Analytics and Speed Insights load from the root layout.
The admin pages are `noindex` and disallowed in `robots.txt`.

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
- `User` and `Account` are the Auth.js tables behind the [admin portal](#admin-portal)'s sign-in.
  The empty `GuestbookNote` stays in the schema although nothing reads it: it is a live table, and `prisma db push` would drop it.
  Whether to build on it or drop it is an [open decision](status.md#open-decisions).

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

Loading a post in `pnpm dev` records a view in whatever database `DATABASE_URL` points at, and signing in to the admin portal writes to `users` and `accounts` there.
The local `.env` points at the Neon `dev` branch; production is the `main` branch, whose URLs are kept apart in `.env.prod.local`.
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

## Admin portal

`/admin` is where Ryan writes posts and adds projects without editing MDX by hand.
Content stays in the repository: the portal is a form over the same files, and GitHub is its only store.

- **A draft is a pull request.** Saving commits the item's file to the branch `content/<collection>/<slug>` and opens a pull request into `main` the first time, so every draft gets CI and a Vercel preview.
  Publishing saves, then squash-merges it and deletes the branch, and Vercel deploys `main`.
  Discarding closes the pull request unmerged.
  A branch whose pull request is no longer open is a leftover, and the next save resets it to `main`.
- **Nothing saved elsewhere is overwritten.** The editor keeps the blob id of the file it loaded and sends it with every write, so GitHub refuses a save over a newer version; publishing passes the commit it saved last, so GitHub refuses to merge anything unseen.
- **Publishing waits out GitHub.** For a few seconds after a push, the pull request still reports its previous head, and the merge API answers 409 or 405.
  `publishDraft` (`src/lib/admin/repository.ts`) retries while the branch still holds the saved commit, and only a moved branch or a real conflict with `main` fails.
- **Files are written exactly as a hand-formatted one.** `src/lib/admin/content-file.ts` writes frontmatter in schema order and flow style, and `src/lib/admin/format.ts` runs Prettier's standalone build with every built-in language, so code blocks are formatted too.
  The standalone build cannot load the Tailwind plugin, which reads the stylesheet from disk, so `prettier.config.js` leaves class sorting out of MDX for the CLI as well; otherwise a saved file could fail `format:check`.
  A test writes every existing content file back byte for byte, and compares the output with the CLI's.
- **The preview is the page.** `renderContentPreview` (`src/components/admin/content-preview.tsx`) renders the item with the post and project pages' own `PostHeader`, `ProjectHeader`, and `ArticleBody` and the MDX pipeline.
  The editor pages render it too, for the preview they open with, and that is load-bearing: a server action can only return client components (the code block's copy button, `next/link`, `next/image`) that the calling page's module graph includes.
  The pages pass it as a `ContentPreview` element rather than a rendered tree, which spares React's development build a false missing-key warning.
- **Unsaved work survives in the browser.** The editor keeps a copy of unsaved changes in `localStorage` and offers it back, so a closed tab or an expired sign-in loses nothing; it also warns before leaving with unsaved changes.
- **Images upload straight to ImageKit** from the browser, signed by a server action (HMAC-SHA1 of a one-time token and expiry under `IMAGEKIT_PRIVATE_KEY`), so files never pass through a server action's 1 MB limit.
  Without `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY` the upload buttons are hidden and image URLs can still be pasted.
  Posts upload into `/Blog/<slug>` and projects into `/Project Screenshots/<slug>`, where the existing screenshots are.

### Sign-in

Auth.js v5 (`src/auth.ts`) with GitHub as the only provider, JWT sessions, and the Prisma adapter for the `users` and `accounts` tables.

- **The provider is a GitHub App**, "Ryan Gan Portfolio Admin", installed on this repository alone, with read and write access to contents and pull requests and read access to email addresses.
  Its token reaches this one repository, where an OAuth App's `public_repo` token could write to every public repository the account has.
  It needs `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET`, and `AUTH_SECRET` signs the session.
- **Only someone who can push to the repository gets in.** The `signIn` callback asks GitHub, before Auth.js writes anything, so a refused sign-in leaves no row behind.
  Admins get the `ADMIN` role, and every admin page and server action checks for it itself: a layout does not protect server actions, which are public endpoints.
- **The portal commits as the signed-in user**, with their GitHub token from `accounts`.
  Auth.js stores tokens only when it first links an account, so the `jwt` callback stores them again on every sign-in.
  GitHub App tokens expire after eight hours; `getGitHubToken` (`src/lib/admin/github-token.ts`) refreshes them, and asks for a new sign-in once the refresh token is spent.
- **The callback URLs** registered on the app are `https://ryangan.me/api/auth/callback/github` and `http://localhost:3000/api/auth/callback/github`, so sign-in works locally only on port 3000.

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
CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck, unit tests, build, and browser tests on every pull request and push to `main`, from a clean install with no secrets.
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
- **next-auth 5.0.0-beta.32**, pinned exactly because v5 has only ever been published as betas, and a caret range would take the next one unreviewed.
  It is the maintained line for Next 16 and the one whose adapter matches the `users` and `accounts` tables.
- **Runtime dependencies that look like dev tools.** `prettier` and the rehype and remark plugins are `dependencies`: the admin portal formats and compiles MDX at request time, not only in the build.

`tests/upstream-pins.test.ts` reads the installed packages and fails, naming what to remove, once a dependency update makes the ESLint, Prisma override, or TypeScript workaround unnecessary.
Dependabot's updates are what trip it.

### Tests

- **Unit tests** (Vitest, `pnpm test`) sit beside their code in `src/` and mock the database.
  `tests/` holds checks on the repository itself.
- **Browser tests** (Playwright, `pnpm test:e2e`) live in `e2e/` and cover the flows that have broken before: the contact form's states, the theme toggle, and client-side navigation.
  For the admin portal they cover what a visitor who is not signed in meets, up to GitHub's authorize URL, which they intercept.
  Past sign-in the portal acts on GitHub as the signed-in user, so its repository calls are unit tested against a fake Octokit instead.

The browser tests run against a production build, since static rendering, prefetching, and the inline theme script only behave as visitors see them there.
`playwright.config.ts` starts that server cut off from everything real:

- `DATABASE_URL` points at a host that cannot resolve, so the view counter and rate limit fail soft, and nothing is written to production.
- Resend is pointed at `e2e/mock-resend.mjs` through `RESEND_BASE_URL`, so no email is sent.
  A subject containing `resend-fail` makes it answer with an error.
- Each contact test sends its own `x-forwarded-for`, so the rate limit, which keys on the caller's IP, cannot leak between tests.
- The Auth.js variables are placeholders, with `AUTH_TRUST_HOST`, which Vercel implies and `next start` does not.

Any console error or uncaught exception fails a test, since that is how hydration mismatches surface.
Vercel's analytics scripts, which only exist on Vercel, are answered with an empty script.
Start the server with `next start`, not `pnpm exec next start`: pnpm's native binary does not pass on the stop signal, and Playwright then waits on the orphaned server forever.
