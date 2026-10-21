import type { Locator, Page } from '@playwright/test';

import { expect, test } from './fixtures';

/** The experience timeline's box, which clips it while it animates */
const timeline = (page: Page) => page.locator('main ol').locator('..');

const entries = (page: Page) => page.locator('main ol > li');

const visibleEntries = (page: Page) => entries(page).filter({ visible: true });

const hiddenHeight = (box: Locator) =>
  box.evaluate((element) => element.scrollHeight - element.clientHeight);

test('expands the experience timeline, and collapses it where it was clicked', async ({
  page,
}) => {
  await page.goto('/');

  const toggle = page.locator('main button[aria-expanded]');
  const total = await entries(page).count();

  expect(total).toBeGreaterThan(2);
  await expect(visibleEntries(page)).toHaveCount(2);
  await expect(toggle).toHaveAccessibleName(`Show ${total - 2} more`);

  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(toggle).toHaveAccessibleName('Show less');
  await expect(visibleEntries(page)).toHaveCount(total);
  await expect.poll(() => hiddenHeight(timeline(page))).toBe(0);

  // Collapse from the bottom of the list, as a reader who just read it would.
  await toggle.evaluate((button) =>
    button.scrollIntoView({ block: 'end', behavior: 'instant' }),
  );
  const before = (await toggle.boundingBox())!.y;

  await toggle.click();

  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(visibleEntries(page)).toHaveCount(2);
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

    await expect(visibleEntries(page)).toHaveCount(await entries(page).count());
    expect(await hiddenHeight(timeline(page))).toBe(0);
    await expect(page.locator('main button[aria-expanded]')).toBeHidden();
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

test('a title that wraps keeps its rule and year on its last line', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  const row = page.locator('main li > a[href^="/blog/"]').first();

  // Long enough to wrap at any phone width, whatever the posts are called.
  const { lastLine, year, rule } = await row.evaluate((link) => {
    const walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
    const title = walker.nextNode() as Text;

    title.data =
      'A title long enough to wrap onto a second line and then a third';

    // Where the text itself sits; a flex item's box spans the whole row.
    const textBottom = (node: Node) => {
      const range = document.createRange();

      range.selectNodeContents(node);

      return [...range.getClientRects()].at(-1)!.bottom;
    };

    const rule = [...link.querySelectorAll('[data-rule]')]
      .find((element) => element.checkVisibility())!
      .getBoundingClientRect();
    const clip = rule.left + 10;

    return {
      lastLine: textBottom(title),
      year: textBottom(link.lastElementChild!),
      rule: {
        middle: rule.top,
        // What shows of it, past the gap after the word and before the end
        width:
          Math.min(
            rule.right,
            link.lastElementChild!.getBoundingClientRect().left - 10,
          ) - clip,
      },
    };
  });

  expect(Math.abs(year - lastLine)).toBeLessThanOrEqual(1);
  expect(lastLine - rule.middle).toBeGreaterThan(0);
  expect(lastLine - rule.middle).toBeLessThan(20);
  expect(rule.width).toBeGreaterThanOrEqual(16);
});

test('fits the narrowest phones without scrolling sideways', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto('/');

  // The footer's row was the widest thing on the page, its theme toggle
  // pushed past the column's edge.
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});
