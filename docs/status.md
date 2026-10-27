# Status

Last reviewed: 2026-10-27.

## Current state

The site is live and feature-complete for now; what remains is mostly outside the code.

- Every dependency is on its latest release except the deliberate [pinned versions](architecture.md#pinned-versions).
- `pnpm audit` reports one moderate advisory, which nothing can fix yet.
  `@tailwindcss/typography` 0.5.20, its latest release, pins `postcss-selector-parser` 6.0.10, and the fix for the quadratic selector parsing is only in 7.1.6.
  It runs at build time on this site's own stylesheet, so no visitor input reaches it.
  It goes away when the plugin moves to 7.
- Format, lint, typecheck, unit tests, build, and browser tests pass locally and in CI.
- Every public route is Static or SSG; the admin portal's routes are dynamic.
- The production database matches `prisma/schema.prisma`; `prisma migrate diff` reports no difference.
- Vercel builds under pnpm 12, including from a restored build cache.
- The contact form sends from `contact@ryangan.me`, verified in Resend under the job-journey team, whose API key production uses.
  A real submission on 2026-10-27 landed in the Gmail inbox, not spam.
- Google Search Console has the `ryangan.me` domain property, verified by a DNS record in Cloudflare, and has read the sitemap.

## Waiting on Ryan

None.

## Open decisions

None.

## Next work

Nothing is queued in code.
The dependency workarounds come out when [their tripwire](architecture.md#pinned-versions) fails on an update.

## Deliberately not done

- **Blog search.** With five posts it would search a list that fits on one screen, and topics already cover browsing.
  Worth adding past a dozen posts.
- **A `/craft` route.** The craft collection is a separate codebase at `craft.ryangan.me`.
- **A uses or now page.** It needs Ryan's content, not code.
- **A script CSP and extended HSTS.** See [Security headers](architecture.md#security-headers).
