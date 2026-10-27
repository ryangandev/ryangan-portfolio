import React from 'react';
import { render } from 'react-email';
import { describe, expect, it } from 'vitest';

import ContactFormEmail, {
  contactFormEmailText,
  contactFormSubject,
} from './contact-form-email';

const props = {
  senderName: 'Ada',
  senderEmail: 'ada@example.com',
  message: 'Hi Ryan,\n\nLoved the <b>post</b>.\nThanks',
};

const renderHtml = (overrides: Partial<typeof props> = {}) =>
  render(React.createElement(ContactFormEmail, { ...props, ...overrides }));

describe('ContactFormEmail', () => {
  it('keeps the line breaks of the message', async () => {
    const html = await renderHtml();

    expect(html).toMatch(/Hi Ryan,<br\/><br\/>Loved the/);
    expect(html).toMatch(/\.<br\/>Thanks/);
  });

  it('escapes markup in the message', async () => {
    const html = await renderHtml();

    expect(html).toContain('Loved the &lt;b&gt;post&lt;/b&gt;.');
    expect(html).not.toContain('<b>post</b>');
  });

  it('replies to the sender under the same subject', async () => {
    const html = await renderHtml();

    expect(html).toContain(
      'href="mailto:ada@example.com?subject=Re%3A%20Ada%20left%20a%20message"',
    );
  });

  it('previews the start of the message, not a description of it', async () => {
    const html = await renderHtml({ message: 'word '.repeat(60) });
    const preview = html.match(/<div[^>]*display:none[^>]*>([^<]*)/)?.[1];

    expect(preview?.startsWith('word word')).toBe(true);
    expect(preview?.endsWith('…')).toBe(true);
    expect(preview?.length).toBeLessThanOrEqual(140);
  });
});

describe('contactFormEmailText', () => {
  it('carries the subject, sender, and message as plain text', () => {
    expect(contactFormEmailText(props)).toBe(
      [
        contactFormSubject('Ada'),
        'From: Ada <ada@example.com>',
        '',
        'Hi Ryan,\n\nLoved the <b>post</b>.\nThanks',
        '',
        '--',
        'Sent from the contact form on ryangan.me.',
        'Replying to this email goes straight to ada@example.com.',
      ].join('\n'),
    );
  });
});
