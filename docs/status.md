# Status

Last reviewed: 2026-09-28.

## Current state

The site is live and feature-complete for now; what remains is mostly outside the code.

- Every dependency is on its latest release except the deliberate [pinned versions](architecture.md#pinned-versions), and `pnpm audit` reports no known vulnerabilities.
- Format, lint, typecheck, tests, and build pass locally and in CI.
- Every route is Static or SSG.
- The production database matches `prisma/schema.prisma`; `prisma migrate diff` reports no difference.
- Vercel builds under pnpm 12, including from a restored build cache.

## Waiting on Ryan

These need an account or a judgment only Ryan has.

1. Check `src/data/experience.ts`.
   The entries date from 2023 and now appear on the home page, with Dynasty11 Studio as the current role.
2. Enable Speed Insights for the project in the Vercel dashboard.
   Until then its script is a 404 on every page.
3. Verify a domain in Resend and set `CONTACT_FROM_EMAIL` to an address on it.
   The default sender only delivers to the Resend account owner.
4. Submit the sitemap to Google Search Console.

## Open decisions

- **Home page copy.** It still says "Currently, I'm exploring GraphQL".
- **Prisma leftovers.** Build the guestbook, or drop `User`, `Account`, and `GuestbookNote` in a migration.
  Until then they stay in the schema; see [Database](architecture.md#database).
- **Comments.** The loading-states post ends by inviting a comment, and there is nowhere to leave one.

## Next work

- Drop the ESLint workarounds, the Prisma overrides, and the TypeScript pin as upstream catches up; Dependabot surfaces each.
- Prune `post_view_sessions`, which grows forever; `viewed_at` is already indexed for it.
- Log database failures with a message: the Neon adapter surfaces them as a bare `ErrorEvent`, which says nothing in the logs.
- Add browser tests for the flows that have broken before: contact form states, the theme toggle, and client-side navigation.

## Deliberately not done

- **Blog search.** With two posts it would search a list that fits on one screen, and topics already cover browsing.
  Worth adding past a dozen posts.
- **A `/craft` route.** The craft collection is a separate codebase at `craft.ryangan.me`.
- **A uses or now page.** It needs Ryan's content, not code.
- **A script CSP and extended HSTS.** See [Security headers](architecture.md#security-headers).
