import type { APIRequestContext, Page } from '@playwright/test';

import { expect, test } from './fixtures';
import { MOCK_RESEND_PORT } from './ports';

type SentEmail = { subject: string; reply_to?: string | string[] };

/** Emails the mock Resend received whose subject contains `marker`. */
const sentWith = async (request: APIRequestContext, marker: string) => {
  const response = await request.get(
    `http://127.0.0.1:${MOCK_RESEND_PORT}/sent`,
  );
  const sent: SentEmail[] = await response.json();

  return sent.filter((email) => email.subject.includes(marker));
};

const field = (page: Page, label: string) =>
  page.getByLabel(label, { exact: true });

const fillForm = async (page: Page, name: string) => {
  await field(page, 'Name').fill(name);
  await field(page, 'Email').fill('reader@example.com');
  await field(page, 'Message').fill('Hello from the browser tests.');
};

const submitButton = (page: Page) =>
  page.getByRole('button', { name: 'Submit' });

test.beforeEach(async ({ page }, testInfo) => {
  // The rate limit keys on the caller's IP, and every test calls from this
  // machine. A distinct address per test keeps them from spending each
  // other's allowance.
  await page.setExtraHTTPHeaders({
    'x-forwarded-for': `e2e-${testInfo.testId}-${testInfo.retry}`,
  });
  await page.goto('/contact');
});

test('flags every empty field, and says which message belongs to which', async ({
  page,
}) => {
  await submitButton(page).click();

  for (const [label, message] of [
    ['Name', 'Name is required'],
    ['Email', 'Invalid email'],
    ['Message', 'Say something in the message'],
  ]) {
    const input = field(page, label);

    await expect(input).toHaveAttribute('aria-invalid', 'true');
    // Every id it points at must exist: they once pointed at a description
    // that was never rendered.
    const ids = (await input.getAttribute('aria-describedby'))!.split(' ');

    for (const id of ids) {
      await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
    }

    await expect(input).toHaveAccessibleDescription(message);
  }
});

test('sends a message, showing progress, then clears the form', async ({
  page,
  request,
}) => {
  const name = `Reader ${test.info().testId}`;

  await fillForm(page, name);
  await submitButton(page).click();

  await expect(submitButton(page)).toBeDisabled();
  await expect(page.getByText('Message sent successfully')).toBeVisible();
  await expect(submitButton(page)).toBeEnabled();
  await expect(field(page, 'Name')).toHaveValue('');
  await expect(field(page, 'Message')).toHaveValue('');

  const sent = await sentWith(request, name);

  expect(sent).toHaveLength(1);
  expect(sent[0]).toMatchObject({
    subject: `${name} left a message`,
    reply_to: 'reader@example.com',
  });
});

test('keeps what was typed when sending fails', async ({ page }) => {
  await fillForm(page, 'resend-fail');
  await submitButton(page).click();

  await expect(page.getByText('Internal Server Error')).toBeVisible();
  await expect(
    page.getByText('Something went wrong. Please try again.'),
  ).toBeVisible();
  await expect(field(page, 'Name')).toHaveValue('resend-fail');
  await expect(submitButton(page)).toBeEnabled();
});

test('pretends to send when the hidden honeypot is filled', async ({
  page,
  request,
}) => {
  const name = `Bot ${test.info().testId}`;

  await fillForm(page, name);
  // The way a bot would, straight into the DOM: the field cannot be focused,
  // so Playwright's `fill` would type into whichever field last had focus.
  // React only sees a value set through the prototype's setter.
  await page.locator('#website').evaluate((input: HTMLInputElement) => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value',
    )!.set!.call(input, 'https://spam.example');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await submitButton(page).click();

  await expect(page.getByText('Message sent successfully')).toBeVisible();
  expect(await sentWith(request, name)).toHaveLength(0);
});

test('stops sending after three messages, without telling the sender', async ({
  page,
  request,
}) => {
  const name = `Repeat ${test.info().testId}`;

  for (let attempt = 1; attempt <= 4; attempt++) {
    await fillForm(page, `${name} #${attempt}`);
    await submitButton(page).click();
    // Every attempt, the dropped fourth included, ends looking like a success.
    await expect(field(page, 'Name')).toHaveValue('');
  }

  expect(await sentWith(request, name)).toHaveLength(3);
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the form is visible', async ({ page }) => {
    const section = page.locator('#contact');

    // It was once server-rendered at opacity 0, waiting on hydration to fade
    // in, so without JavaScript it never appeared.
    await expect(section).toBeVisible();
    await expect
      .poll(() => section.evaluate((el) => getComputedStyle(el).opacity))
      .toBe('1');
    await expect(submitButton(page)).toBeVisible();
  });
});
