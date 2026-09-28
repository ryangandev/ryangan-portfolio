import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    include: ['src/**/*.test.ts'],
    // Date bugs on this site only showed up west of UTC, where a date-only
    // string read as UTC midnight is still the previous day locally. Pinning a
    // zone behind UTC makes the date tests fail the way readers would.
    env: { TZ: 'America/Los_Angeles' },
  },
});
