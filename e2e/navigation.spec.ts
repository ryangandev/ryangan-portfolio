import type { Page } from '@playwright/test';

import { expect, test } from './fixtures';

type Probe = { sameDocument?: boolean; sawLoadingScreen?: boolean };

/**
 * Mark the document, so a full page load (which starts a new one) shows up as
 * the mark disappearing, and watch for a loading screen replacing the page.
 *
 * A root loading.tsx once flashed a full-page "Loading" mid-navigation. That
 * flash needed slow hydration and is not reproduced here; this only catches a
 * loading screen that renders during these navigations.
 */
const watchNavigation = async (page: Page) => {
  await page.evaluate(() => {
    const probe = window as unknown as Probe;

    probe.sameDocument = true;
    new MutationObserver(() => {
      if (
        /^\s*Loading\b/.test(document.querySelector('main')?.innerText ?? '')
      ) {
        probe.sawLoadingScreen = true;
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });

  return async () => {
    const probe = await page.evaluate(() => {
      const { sameDocument, sawLoadingScreen } = window as unknown as Probe;

      return { sameDocument, sawLoadingScreen };
    });

    expect(probe.sameDocument, 'navigation reloaded the page').toBe(true);
    expect(probe.sawLoadingScreen, 'a loading screen flashed').toBeUndefined();
  };
};

test('moves through the portfolio without reloading, and back', async ({
  page,
}) => {
  await page.goto('/');
  const check = await watchNavigation(page);

  await page.locator('main a[href="/portfolio"]').click();
  await expect(page).toHaveURL('/portfolio');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Portfolio');

  const project = page.locator('main a[href^="/portfolio/"]').first();
  const href = (await project.getAttribute('href'))!;

  await project.click();
  await expect(page).toHaveURL(href);

  await page.getByRole('link', { name: 'Portfolio' }).click();
  await expect(page).toHaveURL('/portfolio');

  await page.goBack();
  await expect(page).toHaveURL(href);

  await check();
});

test('opens a post from the blog without reloading, and back', async ({
  page,
}) => {
  await page.goto('/blog');
  const check = await watchNavigation(page);

  const post = page
    .locator('main a[href^="/blog/"]:not([href^="/blog/topics/"])')
    .first();
  const href = (await post.getAttribute('href'))!;

  await post.click();
  await expect(page).toHaveURL(href);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL('/blog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');

  await check();
});

test('does not download the resume just because its link is in view', async ({
  page,
}) => {
  const pdfRequests: string[] = [];

  page.on('request', (request) => {
    if (new URL(request.url()).pathname.endsWith('.pdf')) {
      pdfRequests.push(request.url());
    }
  });

  await page.goto('/');
  await page.locator('main a[href$=".pdf"]').scrollIntoViewIfNeeded();
  await page.waitForLoadState('networkidle');

  expect(pdfRequests).toEqual([]);
});

test('answers an unknown post with a 404 page', async ({
  page,
  consoleErrors,
}) => {
  const response = await page.goto('/blog/not-a-real-post');

  expect(response?.status()).toBe(404);
  await expect(page.getByText('404 - Not Found')).toBeVisible();

  // Chrome logs the page's own 404 status as a console error. Here that is
  // the point, so claim exactly that one and let anything else still fail.
  expect(consoleErrors).toEqual([expect.stringContaining('status of 404')]);
  consoleErrors.length = 0;
});
