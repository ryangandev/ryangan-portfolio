import { describe, expect, it } from 'vitest';

import { getReadingTime } from '@/lib/reading-time';

const words = (count: number) =>
  Array.from({ length: count }, () => 'word').join(' ');

const codeBlock = (lines: number) =>
  [
    '```ts',
    ...Array.from({ length: lines }, (_, i) => `const x${i} = ${i};`),
    '```',
  ].join('\n');

describe('getReadingTime', () => {
  it('never reports less than a minute', () => {
    expect(getReadingTime('')).toBe(1);
    expect(getReadingTime(words(10))).toBe(1);
  });

  it('reads prose at 220 words per minute', () => {
    expect(getReadingTime(words(2200))).toBe(10);
    expect(getReadingTime(words(1100))).toBe(5);
  });

  it('counts fenced code by line at 40 lines per minute, not by token', () => {
    // 400 lines of code is 10 minutes. Counted as prose, the same block is
    // 1600 tokens, about 7 minutes; the separate rate is what the post pages
    // rely on for code-heavy writing.
    expect(getReadingTime(codeBlock(400))).toBe(10);
  });

  it('adds prose and code time together', () => {
    expect(getReadingTime(`${words(1100)}\n\n${codeBlock(200)}`)).toBe(10);
  });

  it('does not count the fence lines themselves', () => {
    // 58 lines is 1.45 minutes, which rounds to 1. Counting the two fence
    // lines as well would make it 60 lines, 1.5 minutes, which rounds to 2.
    expect(getReadingTime(codeBlock(58))).toBe(1);
  });

  it('ignores markdown syntax, tags, and inline code', () => {
    const markup =
      '## Heading\n\n> **bold** _em_ `inline code here`\n\n<Callout>tag</Callout>';

    // Heading, bold, em, tag: four words, not the dozen raw tokens.
    expect(getReadingTime(markup.repeat(55))).toBe(1);
    expect(getReadingTime(markup.repeat(165))).toBe(3);
  });
});
