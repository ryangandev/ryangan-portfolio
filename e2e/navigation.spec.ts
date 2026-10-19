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

type ScrollProbe = { scrollSamples?: number[]; stopSampling?: () => void };

/**
 * Record the scroll position on every frame from now on, so a scroll that
 * animates shows up as the positions it passed through on the way. Call the
 * returned function to stop and read them.
 */
const sampleScroll = async (page: Page) => {
  await page.evaluate(() => {
    const probe = window as unknown as ScrollProbe;
    const samples: number[] = [];
    let frame = 0;

    const sample = () => {
      samples.push(Math.round(window.scrollY));
      frame = requestAnimationFrame(sample);
    };

    probe.scrollSamples = samples;
    probe.stopSampling = () => cancelAnimationFrame(frame);
    sample();
  });

  return () =>
    page.evaluate(() => {
      const probe = window as unknown as ScrollProbe;

      probe.stopSampling?.();

      return probe.scrollSamples ?? [];
    });
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

  // The list is the page before, so the way up goes back to it rather than
  // stacking a second copy on top of the project.
  await page.getByRole('link', { name: 'Back to Portfolio' }).click();
  await expect(page).toHaveURL('/portfolio');

  await page.goForward();
  await expect(page).toHaveURL(href);

  await check();
});

test('goes up from a project the list did not open', async ({ page }) => {
  // A featured project, opened from the home page rather than the list
  await page.goto('/');
  const href = (await page
    .locator('main a[href^="/portfolio/"]')
    .first()
    .getAttribute('href'))!;

  await page.goto(href);
  const check = await watchNavigation(page);

  await page.getByRole('link', { name: 'Back to Portfolio' }).click();
  await expect(page).toHaveURL('/portfolio');

  await page.goBack();
  await expect(page).toHaveURL(href);

  await check();
});

test('goes back up to where the reader left the page', async ({ page }) => {
  await page.goto('/');
  const check = await watchNavigation(page);

  // The blog link is near the bottom of the home page, well past one screen.
  const blog = page.locator('main a[href="/blog"]');

  await blog.scrollIntoViewIfNeeded();
  const scrolledTo = await page.evaluate(() => window.scrollY);

  expect(scrolledTo).toBeGreaterThan(0);

  await blog.click();
  await expect(page).toHaveURL('/blog');
  // A new page starts at the top.
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  // The way back puts the reader where they were at once, rather than
  // scrolling them there from the top: every frame is either the page being
  // left, scrolled to the top, or the home page where it was left.
  let stopSampling = await sampleScroll(page);

  await page.getByRole('link', { name: 'Back to Home' }).click();
  await expect(page).toHaveURL('/');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrolledTo);

  expect(
    (await stopSampling()).filter((y) => y !== 0 && y !== scrolledTo),
    'frames on the way back',
  ).toEqual([]);

  // The browser's own Back button does the same.
  await page.goForward();
  await expect(page).toHaveURL('/blog');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  stopSampling = await sampleScroll(page);

  await page.goBack();
  await expect(page).toHaveURL('/');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(scrolledTo);

  expect(
    (await stopSampling()).filter((y) => y !== 0 && y !== scrolledTo),
    'frames on the way back',
  ).toEqual([]);

  await check();
});

test('starts a page at the top when its top would still be in view', async ({
  page,
}) => {
  // Make the blog list scroll by a little, less than the space above the page
  // in the layout. Arriving from far down the home page, the browser clamps
  // the scroll to that little, which leaves the page's top in view, and Next
  // keeps the scroll position whenever it can see the page's top.
  await page.goto('/blog');
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  await page.setViewportSize({ width: 1280, height: height - 40 });

  await page.goto('/');
  const check = await watchNavigation(page);
  const blog = page.locator('main a[href="/blog"]');

  await blog.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(40);

  await blog.click();
  await expect(page).toHaveURL('/blog');
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  await check();
});

test.describe('the table of contents', () => {
  // The table of contents is in the right-hand gutter, which exists from xl up.
  test.use({ viewport: { width: 1280, height: 800 } });

  const post = '/blog/handle-form-loading-states';

  /**
   * Click the next to last entry, a long jump that still has room below to
   * park its heading at the top, and return every scroll position on the way.
   */
  const jumpToSection = async (page: Page) => {
    const entry = page
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link')
      .nth(-2);
    const id = (await entry.getAttribute('href'))!.slice(1);
    const heading = page.locator(`[id="${id}"]`);
    const stopSampling = await sampleScroll(page);

    await entry.click();
    await expect(page).toHaveURL(`${post}#${id}`);
    await expect(entry).toHaveAttribute('aria-current', 'location');
    // `scroll-mt-20` parks the heading 80px below the top.
    await expect
      .poll(() => heading.evaluate((el) => el.getBoundingClientRect().top))
      .toBeCloseTo(80, 0);

    return stopSampling();
  };

  test('scrolls to a section, and back', async ({ page }) => {
    await page.goto(post);
    const check = await watchNavigation(page);

    const samples = await jumpToSection(page);
    const landedAt = samples.at(-1)!;

    // Smoothly: the jump passes through positions between the top and the
    // section.
    expect(
      samples.filter((y) => y !== 0 && y !== landedAt).length,
      'frames on the way to the section',
    ).toBeGreaterThan(2);

    // Back returns to the top of the post, at once.
    const stopSampling = await sampleScroll(page);

    await page.goBack();
    await expect(page).toHaveURL(post);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

    expect(
      (await stopSampling()).filter((y) => y !== 0 && y !== landedAt),
      'frames on the way back',
    ).toEqual([]);

    await check();
  });

  test('jumps to a section when the reader asks for less motion', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(post);

    const samples = await jumpToSection(page);
    const landedAt = samples.at(-1)!;

    expect(
      samples.filter((y) => y !== 0 && y !== landedAt),
      'frames on the way to the section',
    ).toEqual([]);
  });
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

test('answers an unknown post with a 404 page that leads back in', async ({
  page,
  consoleErrors,
}) => {
  const response = await page.goto('/blog/not-a-real-post');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Page not found',
  );

  // Chrome logs the page's own 404 status as a console error. Here that is
  // the point, so claim exactly that one and let anything else still fail.
  expect(consoleErrors).toEqual([expect.stringContaining('status of 404')]);
  consoleErrors.length = 0;

  const check = await watchNavigation(page);

  await page.locator('main a[href="/blog"]').click();
  await expect(page).toHaveURL('/blog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');

  await check();
});
