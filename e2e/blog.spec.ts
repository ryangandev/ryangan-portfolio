import { expect, test } from './fixtures';

test('lays every post out with its facts left and its contents right', async ({
  page,
}) => {
  await page.goto('/blog');

  const hrefs = await page
    .locator('main a[href^="/blog/"]:not([href^="/blog/topics/"])')
    .evaluateAll((links) => [
      ...new Set(links.map((link) => link.getAttribute('href')!)),
    ]);

  expect(hrefs.length).toBeGreaterThan(0);

  for (const href of hrefs) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(href);

    const contents = page.getByRole('navigation', { name: 'On this page' });
    // The facts follow the back link down the left-hand gutter.
    const facts = page
      .getByRole('link', { name: 'Back to Blog' })
      .locator('xpath=following-sibling::div');
    const byline = page.getByText(/^Published on /);

    await expect(facts.getByText('Published')).toBeVisible();
    await expect(byline).toBeHidden();

    // Every post's facts and table of contents fit this window whole, with
    // no scrolling of their own.
    for (const [rail, name] of [
      [facts, 'facts'],
      [contents.locator('..'), 'table of contents'],
    ] as const) {
      if ((await rail.count()) > 0) {
        expect(
          await rail.evaluate((el) => el.scrollHeight <= el.clientHeight),
          `${href}: the ${name} scroll at 800px`,
        ).toBe(true);
      }
    }

    // Below xl there are no gutters, and the byline carries the facts.
    await page.setViewportSize({ width: 1279, height: 800 });
    await expect(facts).toBeHidden();
    await expect(byline).toBeVisible();
  }
});

test('scrolls a long table of contents in a short window, clear of back to top', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await page.goto('/blog/commonly-used-functions');

  const contents = page.getByRole('navigation', { name: 'On this page' });
  const rail = contents.locator('..');
  const last = contents.getByRole('link').last();
  const backToTop = page.getByRole('button', { name: 'Back to top' });

  expect(await rail.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(
    true,
  );

  // A screen and a half down, where back to top shows under the list
  await page.evaluate(() =>
    window.scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }),
  );
  await expect(backToTop).toBeVisible();

  const [box, buttonBox] = await Promise.all([
    rail.boundingBox(),
    backToTop.boundingBox(),
  ]);

  expect(box!.y).toBe(128);
  expect(box!.y + box!.height).toBeLessThan(buttonBox!.y);

  // Its last entry is reachable by scrolling the list.
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});
