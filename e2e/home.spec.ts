import type { Locator, Page } from '@playwright/test';

import { expect, test } from './fixtures';

/** The experience timeline's scroll box, which clips it while collapsed */
const timeline = (page: Page) => page.locator('main ol').locator('..');

const hiddenHeight = (box: Locator) =>
  box.evaluate((element) => element.scrollHeight - element.clientHeight);

test('expands the experience timeline, and collapses it where it was clicked', async ({
  page,
}) => {
  await page.goto('/');

  const toggle = page.locator('main button[aria-expanded]');

  expect(await hiddenHeight(timeline(page))).toBeGreaterThan(0);
  await expect(toggle).toHaveAccessibleName('Expand to view all');

  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Collapse');
  await expect.poll(() => hiddenHeight(timeline(page))).toBe(0);

  // Collapse from the bottom of the list, as a reader who just read it would.
  await toggle.evaluate((button) =>
    button.scrollIntoView({ block: 'end', behavior: 'instant' }),
  );
  const before = (await toggle.boundingBox())!.y;

  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => hiddenHeight(timeline(page))).toBeGreaterThan(0);
  // The page scrolled up with the list, so the button is still under the
  // pointer rather than a screen or two below the section.
  await expect
    .poll(async () => Math.abs((await toggle.boundingBox())!.y - before))
    .toBeLessThanOrEqual(1);
  await expect(toggle).toBeFocused();
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
