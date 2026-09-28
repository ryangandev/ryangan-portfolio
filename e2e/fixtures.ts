import { test as base, expect } from '@playwright/test';

/**
 * Every test fails on an uncaught exception or a console error, which is how
 * hydration mismatches surface, and ends only once the page is idle.
 *
 * Vercel's analytics scripts only exist on Vercel, so locally they are a 404
 * and a console error on every page. They are answered with an empty script
 * here rather than filtered out of the errors, which would also hide a real
 * failure that happened to mention them.
 */
export const test = base.extend<{ consoleErrors: string[] }>({
  consoleErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];

      await page.route('**/_vercel/**', (route) =>
        route.fulfill({ contentType: 'text/javascript', body: '' }),
      );
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      await use(errors);

      // Next keeps prefetching links as they scroll into view. Closing the
      // page mid-prefetch cuts the stream, and the server logs
      // "The destination stream closed early" for a problem that is not one.
      await page.waitForLoadState('networkidle');

      expect(errors, 'console errors').toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
