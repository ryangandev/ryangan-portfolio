import { expect, test } from './fixtures';
import { PORT } from './ports';

/*
 * The admin portal as a visitor who is not signed in meets it. Everything past
 * sign-in talks to GitHub as the signed-in user, which these tests cannot do.
 */

test('sends a visitor who is not signed in to the sign-in page', async ({
  page,
}) => {
  for (const path of ['/admin', '/admin/posts/new', '/admin/projects/demo']) {
    await page.goto(path);
    await expect(page).toHaveURL(
      `/admin/sign-in?callbackUrl=${encodeURIComponent(path)}`,
    );
  }

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Admin');
  await expect(
    page.getByRole('button', { name: 'Sign in with GitHub' }),
  ).toBeVisible();
  // Behind sign-in, and not for search engines either way.
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  );
});

test('starts the GitHub sign-in, coming back to the page it was sent from', async ({
  page,
}) => {
  let authorize: URL | undefined;

  // Stop at GitHub's door rather than leaving the test environment.
  await page.route('https://github.com/login/oauth/authorize**', (route) => {
    authorize = new URL(route.request().url());

    return route.fulfill({ contentType: 'text/html', body: 'GitHub' });
  });

  await page.goto('/admin/posts/new');
  await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
  await expect(page.getByText('GitHub', { exact: true })).toBeVisible();

  expect(authorize?.searchParams.get('client_id')).toBe('e2e-github-id');
  expect(authorize?.searchParams.get('redirect_uri')).toBe(
    `http://127.0.0.1:${PORT}/api/auth/callback/github`,
  );
});

test('explains a refused sign-in', async ({ page }) => {
  await page.goto('/admin/sign-in?error=AccessDenied');

  await expect(page.getByText(/cannot push to/)).toBeVisible();
});

test('shows an unknown collection or a malformed slug as not found, not a sign-in', async ({
  page,
}) => {
  // Admin pages stream behind their loading bar, so the status is already
  // sent when the page decides it does not exist: this is a 200 with the
  // not-found page, which for a noindex page behind sign-in is fine.
  for (const path of ['/admin/pages/new', '/admin/posts/Not_A_Slug']) {
    await page.goto(path);

    await expect(page).toHaveURL(path);
    await expect(
      page.getByRole('heading', { name: '404 - Not Found' }),
    ).toBeVisible();
  }
});

test('keeps crawlers out of the admin', async ({ request }) => {
  const robots = await (await request.get('/robots.txt')).text();

  expect(robots).toContain('Disallow: /admin');
});
