import { expect, test } from './fixtures';

test('filters the portfolio by platform', async ({ page }) => {
  await page.goto('/portfolio');

  const filters = page.getByRole('group', { name: 'Filter by platform' });
  const projects = page.locator('main li a[href^="/portfolio/"]');
  const all = filters.getByRole('button', { name: /^All/ });
  const total = await projects.count();

  await expect(all).toHaveAttribute('aria-pressed', 'true');
  await expect(all).toHaveText(`All ${total}`);

  // Each filter's count is the number of rows it leaves, and every row left
  // names that platform.
  for (const filter of await filters.getByRole('button').all()) {
    const [label, count] = (await filter.innerText()).split(/\s+/);

    if (label === 'All') {
      continue;
    }

    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
    await expect(all).toHaveAttribute('aria-pressed', 'false');
    await expect(projects).toHaveCount(Number(count));

    for (const project of await projects.all()) {
      await expect(project).toContainText(label);
    }
  }

  await all.click();
  await expect(projects).toHaveCount(total);
});

test("keeps every project's facts and contents in view, clear of back to top", async ({
  page,
}) => {
  await page.goto('/portfolio');

  const hrefs = await page
    .locator('main li a[href^="/portfolio/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!));

  for (const href of hrefs) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(href);

    const back = page.getByRole('link', { name: 'Back to Portfolio' });
    // The facts follow the back link down the left-hand gutter.
    const facts = back.locator('xpath=following-sibling::div');
    const contents = page.getByRole('navigation', { name: 'On this page' });
    const backToTop = page.getByRole('button', { name: 'Back to top' });

    // A screen and a half down, where back to top shows, inside the article
    await page.evaluate(() =>
      window.scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }),
    );
    await expect(backToTop).toBeVisible();

    // The back link and the facts under it stick, and the facts fit whole.
    expect((await back.boundingBox())!.y, `${href}: the back link`).toBe(128);
    await expect(facts.locator('dl')).toBeVisible();
    expect(
      await facts.evaluate((el) => el.scrollHeight <= el.clientHeight),
      `${href}: the facts scroll at 800px`,
    ).toBe(true);

    // The table of contents sticks across the column, and ends above back
    // to top.
    if ((await contents.count()) > 0) {
      const [box, buttonBox] = await Promise.all([
        contents.locator('..').boundingBox(),
        backToTop.boundingBox(),
      ]);

      expect(box!.y, `${href}: the table of contents`).toBe(128);
      expect(
        box!.y + box!.height,
        `${href}: the table of contents runs under back to top`,
      ).toBeLessThan(buttonBox!.y);
    }
  }
});

test('shows a project with its facts and the projects either side', async ({
  page,
}) => {
  await page.goto('/portfolio');

  const rows = page.locator('main li a[href^="/portfolio/"]');
  const [first, second] = await Promise.all([
    rows.nth(0).getAttribute('href'),
    rows.nth(1).getAttribute('href'),
  ]);

  await page.goto(second!);

  // The facts render twice, in the gutter and under the title, and the
  // width decides which one shows.
  const stacks = page.getByRole('list', {
    name: 'Tech stack',
    includeHidden: true,
  });

  await expect(stacks).toHaveCount(2);
  await expect(stacks.filter({ visible: true })).toHaveCount(1);
  await page.setViewportSize({ width: 1024, height: 720 });
  await expect(stacks.filter({ visible: true })).toHaveCount(1);
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(stacks.filter({ visible: true })).toHaveCount(1);

  const more = page.getByRole('navigation', { name: 'More projects' });

  await expect(more.locator('a[rel="prev"]')).toHaveAttribute('href', first!);
  await more.locator('a[rel="prev"]').click();
  await expect(page).toHaveURL(first!);
  // The newest project has nothing before it.
  await expect(more.locator('a[rel="prev"]')).toHaveCount(0);
  await expect(more.locator('a[rel="next"]')).toHaveAttribute('href', second!);
});

test('opens a screenshot full size, browses the others, and closes back onto the one it ended on', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/portfolio/penny-diary');

  const screenshots = page.getByRole('button', { name: /^View full size/ });
  const total = await screenshots.count();
  const viewer = page.getByRole('dialog', { name: 'Screenshots' });
  const counter = viewer.getByText(/^\d+ \/ \d+$/).filter({ visible: true });

  expect(total).toBeGreaterThan(1);
  await screenshots.first().click();
  await expect(viewer).toBeVisible();
  await expect(counter).toHaveText(`1 / ${total}`);

  await page.keyboard.press('ArrowRight');
  await expect(counter).toHaveText(`2 / ${total}`);
  // Back from the first image is the last.
  await viewer.getByRole('button', { name: 'Previous image' }).click();
  await viewer.getByRole('button', { name: 'Previous image' }).click();
  await expect(counter).toHaveText(`${total} / ${total}`);
  await viewer
    .getByRole('button', { name: /^Show / })
    .nth(2)
    .click();
  await expect(counter).toHaveText(`3 / ${total}`);

  const frame = viewer.locator('[data-viewer-frame]');

  await viewer.getByRole('button', { name: 'Zoom in' }).click();
  await expect(frame).toHaveAttribute('style', /scale\(1\.5\)/);
  await page.keyboard.press('0');
  await expect(frame).toHaveAttribute('style', /scale\(1\)/);

  await page.keyboard.press('Escape');
  await expect(viewer).toBeHidden();
  await expect(screenshots.nth(2)).toBeFocused();
  // The page scrolls again once the viewer is gone.
  await expect(page.locator('html')).not.toHaveCSS('overflow', 'hidden');
});

test('lays screenshots out as a lead and two to a row, one per row on a phone', async ({
  page,
}) => {
  const widths = async () => {
    const screenshots = page.getByRole('button', { name: /^View full size/ });

    await expect(screenshots.first()).toBeVisible();

    return screenshots.evaluateAll((buttons) =>
      buttons.map((button) => Math.round(button.getBoundingClientRect().width)),
    );
  };

  await page.setViewportSize({ width: 1280, height: 800 });
  // Seven: the lead, then three full rows
  await page.goto('/portfolio/penny-diary');
  expect(await widths()).toEqual([644, 314, 314, 314, 314, 314, 314]);

  // Four: the one left over after the rows spans the column too
  await page.goto('/portfolio/iconio');
  expect(await widths()).toEqual([644, 314, 314, 644]);

  await page.setViewportSize({ width: 390, height: 844 });
  // Every image as wide as the lead, the width of the column
  expect(new Set(await widths()).size).toBe(1);
});
