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

test("keeps every project's facts in view, clear of back to top", async ({
  page,
}) => {
  await page.goto('/portfolio');

  const hrefs = await page
    .locator('main li a[href^="/portfolio/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')!));

  for (const href of hrefs) {
    // The shortest window the facts stick in, the `tall` variant
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(href);

    const facts = page.locator('main aside dl');
    const backToTop = page.getByRole('button', { name: 'Back to top' });

    // A screen and a half down, where back to top shows, inside the article
    await page.evaluate(() =>
      window.scrollTo({ top: innerHeight * 1.5, behavior: 'instant' }),
    );
    await expect(backToTop).toBeVisible();

    const [factsBox, buttonBox] = await Promise.all([
      facts.boundingBox(),
      backToTop.boundingBox(),
    ]);

    expect(factsBox!.y, `${href}: the facts scrolled away`).toBe(128);
    expect(
      factsBox!.y + factsBox!.height,
      `${href}: the facts run under back to top`,
    ).toBeLessThan(buttonBox!.y);

    // One pixel shorter, they scroll away with the header.
    await page.setViewportSize({ width: 1280, height: 799 });
    await expect
      .poll(async () => (await facts.boundingBox())!.y)
      .toBeLessThan(0);
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
