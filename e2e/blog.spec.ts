import { expect, test } from './fixtures';

test('lays every post out with its contents left and its facts right', async ({
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
    // The `tall` variant's height, the shortest a project's facts stick in
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(href);

    const contents = page.getByRole('navigation', { name: 'On this page' });
    const facts = page.locator('main aside dl');
    const byline = page.getByText(/^Published on /);

    await expect(facts.getByText('Published')).toBeVisible();
    await expect(byline).toBeHidden();

    // Every post's table of contents fits this window whole, with no
    // scrolling of its own.
    if ((await contents.count()) > 0) {
      const rail = contents.locator('..');

      expect(
        await rail.evaluate((el) => el.scrollHeight <= el.clientHeight),
        `${href}: the table of contents scrolls at 800px`,
      ).toBe(true);
    }

    // Below xl there are no gutters, and the byline carries the facts.
    await page.setViewportSize({ width: 1279, height: 800 });
    await expect(facts).toBeHidden();
    await expect(byline).toBeVisible();
  }
});

test('scrolls a long table of contents in a short window', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await page.goto('/blog/commonly-used-functions');

  const contents = page.getByRole('navigation', { name: 'On this page' });
  const rail = contents.locator('..');
  const last = contents.getByRole('link').last();

  expect(await rail.evaluate((el) => el.scrollHeight > el.clientHeight)).toBe(
    true,
  );

  // The list ends above the bottom of the window, so its last entry is
  // reachable by scrolling the list.
  const box = (await rail.boundingBox())!;

  expect(box.y + box.height).toBeLessThanOrEqual(560);
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});
