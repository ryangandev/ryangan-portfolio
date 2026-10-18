import { describe, expect, it, vi } from 'vitest';

// Only compiling is under test, and the components pull in next/font and
// next/link, which resolve only inside a Next build.
const stub = vi.hoisted(() => () => ({ default: () => null }));

vi.mock('@/components/callout', stub);
vi.mock('@/components/mdx/custom-code', stub);
vi.mock('@/components/mdx/custom-image', stub);
vi.mock('@/components/mdx/custom-link', stub);
vi.mock('@/components/mdx/custom-pre', stub);

const { compileMdx } = await import('@/components/mdx/mdx-components');

describe('compileMdx', () => {
  it('collects the section headings with their ids', async () => {
    const { headings } = await compileMdx(
      '## First `step`\n\nText\n\n### Not a section\n\n## Second\n',
    );

    expect(headings).toEqual([
      { id: 'first-step', text: 'First step' },
      { id: 'second', text: 'Second' },
    ]);
  });

  it('accepts a component with literal attributes', async () => {
    await expect(
      compileMdx('<Callout type="warning">Careful</Callout>\n'),
    ).resolves.toBeDefined();
  });

  it('accepts braces in code and escaped in text', async () => {
    await expect(
      compileMdx(
        'Use `{ a: 1 }` or \\{ b \\}.\n\n```js\nconst c = { d };\n```\n',
      ),
    ).resolves.toBeDefined();
  });

  it.each([
    ['an import', "import fs from 'fs'\n\n# Title\n", '1:1-1:20'],
    ['an export', 'Text\n\nexport const a = 1\n', '3:1-3:19'],
    ['an expression', 'Text\n\n{process.exit()}\n', '3:1-3:17'],
    ['an inline expression', 'Text {globalThis.x} here\n', '1:6-1:20'],
    ['an expression attribute', '<Callout type={x}>Hi</Callout>\n', '1:1-1:31'],
    ['a spread attribute', '<Callout {...props}>Hi</Callout>\n', '1:1-1:33'],
  ])('refuses %s, naming where', async (_, source, place) => {
    await expect(compileMdx(source)).rejects.toThrow(
      'JavaScript is not allowed in content; escape a literal brace as `\\{` ' +
        `(${place})`,
    );
  });
});
