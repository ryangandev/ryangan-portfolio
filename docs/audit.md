# Portfolio audit

Living record of the audits that followed the Next 16 / Tailwind 4 / Prisma 7 upgrade.
Part 1 is where things stand.
Part 2 is what each pass changed and how it was checked.
Part 3 is what is still open, starting with what needs you.

The original findings are in this file's history: first written in July 2026 as `docs/audit-2026-07.md`, before any of it was fixed.
Every change below is its own commit on `fix/audit-first-pass`, with the evidence in the commit message.

---

# Part 1 - Current state (September 28, 2026)

| Check               | Result                                                                               |
| ------------------- | ------------------------------------------------------------------------------------ |
| `pnpm audit`        | No known vulnerabilities (was 34 in July, 26 before the second pass)                 |
| `pnpm lint`         | Passes, on ESLint 10                                                                 |
| `pnpm typecheck`    | Passes                                                                               |
| `pnpm test`         | 43 tests in 5 files pass                                                             |
| `pnpm format:check` | Passes for the whole repository                                                      |
| `pnpm build`        | Passes; every route is Static or SSG, 28 prerendered including 2 generated OG cards  |
| CI                  | The same five checks run on every pull request, from a clean install with no secrets |
| Vercel              | The preview deployment of this branch builds, the first build under pnpm 12          |
| Installs            | No warnings on pnpm 12.6; frozen installs also verified on pnpm 10.34                |
| Production database | In sync with the schema: `prisma migrate diff` reports no difference                 |

Every dependency is on its latest release, with two deliberate exceptions:

- **TypeScript 6.0.3.** TypeScript 7.0 has no programmatic API, so typescript-eslint cannot load.
  `next build` does run on it now.
  Revisit at 7.1.
- **Prisma 7.10.0.** Prisma 8 is tagged `latest` on npm but is still a release candidate.

---

# Part 2 - What changed

## First pass (July 2026)

Vulnerabilities went from 34 to 7, by refreshing a stale lockfile (18 advisories were already fixed inside existing ranges) and taking Next 16.2.12.

Nine user-visible bugs were fixed, each reproduced first:

| Bug                                                               | Fix                                                     |
| ----------------------------------------------------------------- | ------------------------------------------------------- |
| Every date rendered a day early west of UTC                       | `parseContentDate` reads `YYYY-MM-DD` as local midnight |
| The portfolio search crashed on `(`, `[`, `*`, `+`, `?`, `\`      | The search term is escaped before building the RegExp   |
| Featured projects were sorted oldest first                        | One sort, shared with the portfolio page                |
| A stray `.DS_Store` broke the build                               | Only `.mdx` files are content                           |
| The contact form was an unauthenticated email relay               | Field bounds, a honeypot, and a rate limit              |
| The Discord control was a `<span onClick>`                        | A real button with a focus ring                         |
| Every image was marked `priority`                                 | Only the first two portfolio cards and the project hero |
| Callout variants were unreadable in dark mode                     | Dark variants                                           |
| Error logging, a lying type, prefix path matching, a magic number | Each fixed individually                                 |

It also added `sitemap.xml`, `robots.txt`, and per-page descriptions, canonical URLs, and OpenGraph tags.

## Second pass (September 2026)

### The branch itself

- **Merge conflict.** `main` had picked up the first version of the audit doc as its own commit, so both sides added the same file.
  The branch was rebased onto `main` without its duplicate, which removed the conflict with no content change.
- **Commit messages.** Every commit carried an agent co-author trailer, and many used em dashes, both against standing preferences.
  All 15 messages were rewritten; the resulting tree was byte-identical to before.

### Dependencies: 26 advisories to 0

Two critical advisories had been published since July, both unauthenticated remote code execution in Next.js.

| Step                                               | Advisories left |
| -------------------------------------------------- | --------------- |
| Baseline, September 28                             | 26 (2 critical) |
| Next.js 16.2.12 to 16.3.6                          | 18              |
| React 19.3, Prisma 7.10, refresh within ranges     | 3               |
| Override `mysql2` and `deepmerge-ts` in Prisma CLI | **0**           |

Next 16.3 moved its own `postcss` and `sharp` pins forward, so the overrides deferred in July were never needed.
The two overrides that remain are both CLI-only; the `deepmerge-ts` one crosses a major, checked by running `prisma validate` and `prisma generate` through it.

Also upgraded: dotenv 18, and ESLint 10.
ESLint 9 had gone out of support; 10 runs with two documented workarounds, one skipping a crash in eslint-plugin-react's version detection and one accepting three plugins' outdated peer ranges.
The rules were checked to fire identically on 9 and 10 against a probe file.

pnpm 12 had stopped reading the `pnpm` field in `package.json`, which made every install fail.
The settings moved to `pnpm-workspace.yaml`, and `packageManager` now pins pnpm for local, CI, and Vercel alike.

### Production database

`contact_submissions` was created with `prisma db push` on September 28.
A read-only `prisma migrate diff` against production beforehand showed exactly one `CREATE TABLE` and two `CREATE INDEX`, with nothing altered or dropped, so the existing tables already matched the schema.
Afterwards the same diff reports no difference.
The code deployed before this branch never reads the table, so creating it ahead of the merge changed nothing live.

### Cleanup

- Two unreachable component trees deleted: the site header with its navigation, and the skills section with its scroll tracking, 14 files in all.
- Three dependencies removed with them: `@radix-ui/react-dropdown-menu`, `react-intersection-observer`, and `framer-motion`.
- The theme provider is rendered directly in the root layout; both wrapper files are gone.
- Unused exports and commented-out markup removed.
- Typos fixed across pages, content, and the contact email, found by a spell check rather than only the known list.
- The repository passes `prettier --check` as a whole, and em dashes are gone from code, config, and docs.

### Structure

- **Frontmatter is validated with Zod.** A malformed file fails the build with its path and every bad field.
  It also stopped the slug pages from swallowing such errors into a 404.
- **Content readers are cached per request.** Build-time file reads went from 23 to 18, one saved per slug page.
- **TechStackIcon is a typed map** carrying display labels, so the project page shows "C#" and "Photoshop" instead of "CSHARP" and "ADOBEPS".
- **The contact rate limit is durable**, counted in Postgres across serverless instances, with an in-memory fallback until the table exists.
- **Security headers:** `nosniff`, referrer policy, `frame-ancestors 'none'`, permissions policy, and no `X-Powered-By`.
- **Tests, CI, and Dependabot.**

### Bugs found along the way

Each was reproduced in the browser or against a production build before it was fixed.

| Bug                                                                                                   | Evidence                                      |
| ----------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| The contact section was server-rendered `opacity:0`, invisible until hydration and forever without JS | Served HTML had `style="opacity:0"`           |
| Every form input's `aria-describedby` pointed at an element that did not exist                        | DOM check before and after an empty submit    |
| The author avatar was an oval and fetched a 2048px image for 40px                                     | Rendered 40x42.6; fetched width 2048, now 96  |
| Every `sizes` value was invalid or wrong, so all images fetched 2048px                                | Cards now 640, hero 1920                      |
| The project header's links sat 6px below the byline's center, and 10px out of line on mobile          | Measured box positions                        |
| The home page prefetched the 121 KB resume PDF for every visitor who scrolled past it                 | Next's Link source, and the prefetch replayed |
| A list item in the loading-states post rendered as a paragraph starting "-May"                        | Rendered DOM                                  |
| External link arrows left a gap before commas and periods                                             | Measured 4.67px, now 2.67px                   |
| Wrapped titles on the home page floated their rule between lines on mobile                            | Measured rule and year positions              |

### Features

- **Experience timeline** on the home page, from the entries already written in `src/data/experience.ts`.
- **Writing** section on the home page: flagged posts, or the two newest.
- **Topics:** chips on each post, and a static page per topic.
- **Older and newer post links** at the end of each post.
- **RSS feed** at `/feed.xml`, advertised on the home and blog pages.
- **JSON-LD:** a Person on the home page and a BlogPosting on each post.
- **OpenGraph cards** generated per post, in the site card's style.
- **Table of contents** beside posts from `xl` up, following the reader's position.
- **Reading progress bar,** a CSS scroll-driven animation with no JavaScript.
- **Vercel Speed Insights** for real-user Core Web Vitals.

---

# Part 3 - What is still open

## Needs you

1. **Check the experience entries before merging.** They date from 2023 and now appear on the home page, including Dynasty11 Studio as the current role.
   The Drexel description was trimmed because it repeated the degree and the date shown beside it.
2. **Enable Speed Insights** for the project in the Vercel dashboard.
   Until then its script is a 404 on every page.
3. **Verify a domain in Resend** and set `CONTACT_FROM_EMAIL` to an address on it.
   The default sender only delivers to the Resend account owner.
4. **Submit the sitemap** to Google Search Console.
   It now also lists the seven topic pages.

## Decisions left to you

- **The home page copy** still says "3 years of experience" and "Currently, I'm exploring GraphQL", from a 2024 resume.
- **Prisma leftovers.** `User`, `Account`, and `GuestbookNote` stay in the schema only so `db push` does not drop them.
  Build the guestbook or drop them in a migration.
- **Comments.** The loading-states post ends by inviting readers to leave a comment, and there is nowhere to leave one.
- **Pinning a post.** Setting `featured: true` on a post replaces the two newest on the home page with the flagged ones.

## Deliberately not done

- **Blog search.** With two posts it would be a search box over a list that fits on one screen, and topics already cover browsing.
  Worth adding past a dozen posts.
- **A `/craft` route.** The craft collection lives in a separate codebase at `craft.ryangan.me`.
- **A uses or now page.** It needs your content, not code.
- **A script CSP.** It needs a per-request nonce, which would make every static page dynamic.
- **HSTS `includeSubDomains` or `preload`.** Vercel already sends HSTS, and extending it commits every subdomain to HTTPS.

## Ideas for a next pass

- Drop the ESLint workarounds, the Prisma overrides, and the TypeScript pin as upstream catches up; Dependabot will surface each.
- Prune `post_view_sessions`, which grows forever; `viewed_at` is already indexed for it.
- Log database failures with a message: the Neon adapter surfaces them as a bare `ErrorEvent`, which says nothing in the logs.
- A browser test for the flows that have broken before: contact form states, theme toggle, and client-side navigation.
