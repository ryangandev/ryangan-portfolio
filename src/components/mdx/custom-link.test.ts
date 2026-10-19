import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import CustomLink, { sitePagePath } from '@/components/mdx/custom-link';

const render = (href: string) =>
  renderToStaticMarkup(createElement(CustomLink, { href }, 'Text'));

const opensInNewTab = (html: string) =>
  html.includes('target="_blank"') &&
  html.includes('rel="noopener noreferrer"') &&
  html.includes('<svg');

describe('CustomLink', () => {
  it('opens a page of this site in place, without the arrow', () => {
    const html = render('/portfolio/penny-diary');

    expect(html).toContain('href="/portfolio/penny-diary"');
    expect(html).not.toContain('target=');
    expect(html).not.toContain('<svg');
  });

  it('opens a full URL of a page of this site in place, as a path', () => {
    const html = render('https://ryangan.me/blog/some-post#a-section');

    expect(html).toContain('href="/blog/some-post#a-section"');
    expect(html).not.toContain('target=');
  });

  it('opens another site in a new tab, with the arrow', () => {
    const html = render('https://github.com/ryangandev');

    expect(html).toContain('href="https://github.com/ryangandev"');
    expect(opensInNewTab(html)).toBe(true);
  });

  it('opens a file of this site in a new tab, with the arrow', () => {
    const html = render('/RyanGan_Resume.pdf');

    expect(html).toContain('href="/RyanGan_Resume.pdf"');
    expect(opensInNewTab(html)).toBe(true);
  });

  it('keeps a # link on the page', () => {
    const html = render('#a-section');

    expect(html).toContain('href="#a-section"');
    expect(html).not.toContain('target=');
    expect(html).not.toContain('<svg');
  });
});

describe('sitePagePath', () => {
  it.each([
    ['/', '/'],
    ['/blog', '/blog'],
    [
      '/portfolio/penny-diary?tab=1#notes',
      '/portfolio/penny-diary?tab=1#notes',
    ],
    ['https://ryangan.me', '/'],
    ['https://ryangan.me/blog/some-post', '/blog/some-post'],
  ])('takes %s as the page %s', (href, path) => {
    expect(sitePagePath(href)).toBe(path);
  });

  it.each([
    'https://github.com/ryangandev',
    'https://ryangan.me.example.com/blog',
    'http://ryangan.me/blog',
    '//example.com/blog',
    'mailto:hello@example.com',
    'relative/page',
    '/RyanGan_Resume.pdf',
    '/feed.xml',
    'https://ryangan.me/sitemap.xml',
  ])('takes %s as not a page of this site', (href) => {
    expect(sitePagePath(href)).toBeNull();
  });
});
