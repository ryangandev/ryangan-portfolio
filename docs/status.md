# Status

Last reviewed: 2026-09-29.

## Current state

The site is live and feature-complete for now; what remains is mostly outside the code.

- Every dependency is on its latest release except the deliberate [pinned versions](architecture.md#pinned-versions), and `pnpm audit` reports no known vulnerabilities.
- Format, lint, typecheck, unit tests, build, and browser tests pass locally and in CI.
- Every public route is Static or SSG; the admin portal's routes are dynamic.
- The production database matches `prisma/schema.prisma`; `prisma migrate diff` reports no difference.
- Vercel builds under pnpm 12, including from a restored build cache.

## Waiting on Ryan

These need an account or a judgment only Ryan has.

1. Enable Speed Insights for the project in the Vercel dashboard.
   Until then its script is a 404 on every page.
2. Verify a domain in Resend and set `CONTACT_FROM_EMAIL` to an address on it.
   The default sender only delivers to the Resend account owner.
3. Submit the sitemap to Google Search Console.
4. Redirect `www.ryangan.me` to `ryangan.me` in the Vercel domain settings.
   Both serve the site today, and the GitHub App only accepts the `ryangan.me` callback, so signing in to `/admin` from `www` fails.

## Open decisions

- **Guestbook table.** Build the guestbook, or drop `GuestbookNote` in a migration.
  Until then it stays in the schema; see [Database](architecture.md#database).
  `User` and `Account` back the admin portal's sign-in.
- **Comments.** The loading-states post ends by inviting a comment, and there is nowhere to leave one.

## Next work

Nothing is queued in code.
The dependency workarounds come out when [their tripwire](architecture.md#pinned-versions) fails on an update.

## Deliberately not done

- **Blog search.** With two posts it would search a list that fits on one screen, and topics already cover browsing.
  Worth adding past a dozen posts.
- **A `/craft` route.** The craft collection is a separate codebase at `craft.ryangan.me`.
- **A uses or now page.** It needs Ryan's content, not code.
- **A script CSP and extended HSTS.** See [Security headers](architecture.md#security-headers).
