import { describe, expect, it } from 'vitest';

import { displayUrlParts } from '@/lib/display-url';

describe('displayUrlParts', () => {
  it('drops the scheme, www and a trailing slash', () => {
    expect(displayUrlParts('https://www.footyrootyspa.com/')).toEqual([
      'footyrootyspa.com',
    ]);
  });

  it('reads a GitHub repository as owner/repo', () => {
    expect(
      displayUrlParts('https://github.com/ryangandev/ryangan-portfolio'),
    ).toEqual(['ryangandev/', 'ryangan-portfolio']);
  });

  it('keeps the host for any other GitHub page', () => {
    expect(displayUrlParts('https://github.com/ryangandev')).toEqual([
      'github.com/',
      'ryangandev',
    ]);
  });

  it('splits a path after each slash, never at a hyphen', () => {
    expect(
      displayUrlParts('https://michael-anderson.itch.io/grapple-grub'),
    ).toEqual(['michael-anderson.itch.io/', 'grapple-grub']);
  });
});
