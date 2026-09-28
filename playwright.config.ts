import { defineConfig, devices } from '@playwright/test';

import { MOCK_RESEND_PORT, PORT } from './e2e/ports';

/**
 * Browser tests for the flows that have broken before, run against a
 * production build: that is where static rendering, prefetching, and the
 * inline theme script behave as they do for visitors.
 *
 * The server is cut off from everything real. `DATABASE_URL` points at a host
 * that cannot resolve, so the view counter and the rate limit fail soft as
 * they would during an outage, and Resend is pointed at a local mock
 * (`e2e/mock-resend.mjs`), so no email is ever sent. These values override the
 * ones in `.env`, which Next only reads for variables not already set.
 */
export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'node e2e/mock-resend.mjs',
      url: `http://127.0.0.1:${MOCK_RESEND_PORT}/health`,
      env: { PORT: String(MOCK_RESEND_PORT) },
      reuseExistingServer: false,
    },
    {
      // CI has just built in an earlier step. Locally, build every time, so
      // the tests can never run against a stale `.next`.
      //
      // `next start` rather than `pnpm exec next start`: pnpm's native binary
      // does not pass the stop signal on, so the server outlived the run and
      // Playwright waited on it forever.
      command: `${process.env.CI ? '' : 'pnpm build && '}next start --port ${PORT}`,
      url: `http://127.0.0.1:${PORT}`,
      timeout: 300_000,
      env: {
        DATABASE_URL: 'postgresql://e2e:e2e@db.invalid/e2e',
        RESEND_API_KEY: 're_e2e',
        RESEND_BASE_URL: `http://127.0.0.1:${MOCK_RESEND_PORT}`,
      },
      reuseExistingServer: false,
    },
  ],
});
