import type { Locator, Page } from '@playwright/test';

import { expect, test } from './fixtures';

/** The experience timeline's scroll box, which clips it while collapsed */
const timeline = (page: Page) => page.locator('main ol').locator('..');

const hiddenHeight = (box: Locator) =>
  box.evaluate((element) => element.scrollHeight - element.clientHeight);

test('shows the start of the experience timeline, and all of it on request', async ({
  page,
}) => {
  await page.goto('/');

  const expand = page.getByRole('button', { name: 'Expand to view all' });

  expect(await hiddenHeight(timeline(page))).toBeGreaterThan(0);
  await expect(expand).toHaveAttribute('aria-expanded', 'false');

  await expand.click();

  await expect(expand).toBeHidden();
  await expect.poll(() => hiddenHeight(timeline(page))).toBe(0);
  // The button that had focus is gone, so focus moves to what it revealed.
  await expect(timeline(page)).toBeFocused();
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the whole timeline shows, since nothing could expand it', async ({
    page,
  }) => {
    await page.goto('/');

    expect(await hiddenHeight(timeline(page))).toBe(0);
    await expect(
      page.getByRole('button', { name: 'Expand to view all' }),
    ).toBeHidden();
  });
});

test('offers a way back to the top once the top is out of reach', async ({
  page,
}) => {
  await page.goto('/');

  const backToTop = page.getByRole('button', { name: 'Back to top' });

  await expect(backToTop).toBeHidden();

  await page.evaluate(() =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
  );
  await backToTop.click();

  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(backToTop).toBeHidden();
  // The button hides at the top, so focus moves to the page itself.
  await expect(page.locator('main')).toBeFocused();
});
