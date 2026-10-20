import { describe, expect, it } from 'vitest';

import { groupImages } from '@/components/mdx/group-images';

type Node = {
  type: string;
  url?: string;
  value?: string;
  name?: string;
  children?: Node[];
};

const image = (url: string): Node => ({ type: 'image', url });
const text = (value: string): Node => ({ type: 'text', value });
const paragraph = (...children: Node[]): Node => ({
  type: 'paragraph',
  children,
});

const group = (...children: Node[]) => {
  const tree: Node = { type: 'root', children };

  groupImages()(tree);

  return tree.children!;
};

describe('groupImages', () => {
  it('turns images on consecutive lines into a gallery of just the images', () => {
    expect(
      group(
        paragraph(image('a'), text('\n'), image('b'), text('\n'), image('c')),
      ),
    ).toEqual([
      {
        type: 'mdxJsxFlowElement',
        name: 'ImageGallery',
        attributes: [],
        children: [image('a'), image('b'), image('c')],
      },
    ]);
  });

  it('leaves an image on its own as it is', () => {
    const alone = paragraph(image('a'));

    expect(group(alone)).toEqual([alone]);
  });

  it('leaves images that share a paragraph with words', () => {
    const mixed = paragraph(image('a'), text(' and '), image('b'));

    expect(group(mixed)).toEqual([mixed]);
  });

  it('finds images inside other blocks', () => {
    const [quote] = group({
      type: 'blockquote',
      children: [paragraph(image('a'), text('\n'), image('b'))],
    });

    expect(quote.children![0].name).toBe('ImageGallery');
  });
});
