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

test('shows the contents without the facts from lg to xl, centred with the column', async ({
  page,
}) => {
  /**
   * The room left of the column and right of the contents, the footer's left
   * edge, and the page's width
   */
  const measure = () =>
    page.evaluate(() => {
      // `scrollbar-gutter: stable` keeps room for a scrollbar even where
      // none shows, so the body, not the window, is the page's width.
      const width = document.body.getBoundingClientRect().width;
      const rail = document.querySelector('[data-contents-gutter] > div');

      return {
        width,
        column: document.querySelector('main')!.getBoundingClientRect().left,
        footer: document
          .querySelector('[data-footer-column]')!
          .getBoundingClientRect().left,
        contents: rail?.checkVisibility()
          ? width - rail.getBoundingClientRect().right
          : null,
      };
    });

  for (const [href, back] of [
    ['/blog/local-first-sync-and-report-parity', 'Back to Blog'],
    ['/portfolio/penny-diary', 'Back to Portfolio'],
  ]) {
    const contents = page.getByRole('navigation', { name: 'On this page' });
    const facts = page
      .getByRole('link', { name: back })
      .locator('xpath=following-sibling::div');

    // The narrowest window with the contents. The column and the contents,
    // 876px together, are centred as a pair, and the footer lines up with the
    // column.
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto(href);
    await expect(contents).toBeVisible();
    await expect(facts).toBeHidden();

    const pair = await measure();

    expect(pair.column, href).toBe((pair.width - 876) / 2);
    expect(pair.contents, href).toBe(pair.column);
    expect(pair.footer, href).toBe(pair.column);

    // One pixel narrower, the contents go and the column centres alone.
    await page.setViewportSize({ width: 1023, height: 800 });
    await expect(contents).toBeHidden();

    const alone = await measure();

    expect(alone.column, href).toBe((alone.width - 644) / 2);
    expect(alone.footer, href).toBe(alone.column);
  }

  // A page without contents stays centred.
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/blog');

  const list = await measure();

  expect(list.column).toBe((list.width - 644) / 2);
});

test('on a phone, puts the year on its own line and gives the titles the width', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');

  const first = page
    .locator('main a[href^="/blog/"]:not([href^="/blog/topics/"])')
    .first();
  const title = first.locator('span').nth(2);

  // The year column is hidden, so a title starts at the list's left edge.
  const [list, start] = await Promise.all([
    page.locator('main section').evaluate((el) => el.getBoundingClientRect()),
    title.evaluate((el) => el.getBoundingClientRect().left),
  ]);

  expect(start).toBe(list.left);
  await expect(
    page.locator('main section li', { hasText: /^\d{4}$/ }).first(),
  ).toBeVisible();
});

test('sends the old addresses of renamed topics to their new pages', async ({
  page,
}) => {
  await page.goto('/blog/topics/nextjs');
  await expect(page).toHaveURL('/blog/topics/next-js');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Next.js');
  await expect(page).toHaveTitle('Posts about Next.js - Ryan Gan');
});
