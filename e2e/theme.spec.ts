import { expect, test } from './fixtures';

const DARK = /(^|\s)dark(\s|$)/;

test('toggles the theme and keeps it across reloads and navigation', async ({
  page,
}) => {
  const html = page.locator('html');
  const toggle = page.getByRole('button', { name: 'Toggle theme' });

  await page.goto('/');
  await expect(html).not.toHaveClass(DARK);

  await toggle.click();
  await expect(html).toHaveClass(DARK);
  expect(await page.evaluate(() => localStorage.getItem('rg-theme'))).toBe(
    'dark',
  );

  await page.reload();
  await expect(html).toHaveClass(DARK);

  await page.locator('main a[href="/portfolio"]').click();
  await expect(page).toHaveURL('/portfolio');
  await expect(html).toHaveClass(DARK);

  await toggle.click();
  await expect(html).not.toHaveClass(DARK);
});

test('applies a saved theme before any content renders', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('rg-theme', 'dark');

    // Note the theme at the moment the page's content is parsed, which is
    // before hydration. Anything set later would flash light first.
    new MutationObserver((_, observer) => {
      if (document.querySelector('main')) {
        (window as unknown as Record<string, string>).themeAtFirstContent =
          document.documentElement.className;
        observer.disconnect();
      }
    }).observe(document, { childList: true, subtree: true });
  });

  await page.goto('/blog');

  expect(
    await page.evaluate(
      () => (window as unknown as Record<string, string>).themeAtFirstContent,
    ),
  ).toMatch(DARK);
});
