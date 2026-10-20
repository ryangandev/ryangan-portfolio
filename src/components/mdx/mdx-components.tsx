import React from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import type { MDXComponents } from 'mdx/types';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

import Callout from '@/components/callout';
import CustomCode from '@/components/mdx/custom-code';
import CustomImage from '@/components/mdx/custom-image';
import CustomLink from '@/components/mdx/custom-link';
import CustomPre from '@/components/mdx/custom-pre';
import { groupImages } from '@/components/mdx/group-images';
import ImageGallery from '@/components/mdx/image-gallery';

const components: MDXComponents = {
  a: CustomLink,
  code: CustomCode,
  img: CustomImage,
  pre: CustomPre,
  Callout,
  ImageGallery,
};

/** A section heading, as rehype-slug left it */
export type MdxHeading = {
  id: string;
  text: string;
};

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

const textOf = (node: HastNode): string =>
  node.type === 'text'
    ? (node.value ?? '')
    : (node.children ?? []).map(textOf).join('');

/**
 * A rehype plugin that records every `h2` with the id rehype-slug gave it.
 *
 * It runs inside the real pipeline, directly after rehype-slug, so the ids are
 * exactly the ones in the rendered page. Re-deriving them from the Markdown
 * would mean re-implementing the slugger and stripping inline code, links, and
 * emphasis the way rehype does, and drifting the first time either differed.
 */
const collectHeadings = (headings: MdxHeading[]) => () => (tree: HastNode) => {
  const visit = (node: HastNode) => {
    if (node.tagName === 'h2' && typeof node.properties?.id === 'string') {
      headings.push({ id: node.properties.id, text: textOf(node).trim() });
    }

    node.children?.forEach(visit);
  };

  visit(tree);
};

type Point = { line: number; column: number };

type MdastNode = {
  type: string;
  attributes?: { type: string; value?: unknown }[];
  children?: MdastNode[];
  position?: { start: Point; end: Point };
};

/** Nodes that only exist to carry JavaScript */
const scriptNodeTypes = new Set([
  'mdxjsEsm',
  'mdxFlowExpression',
  'mdxTextExpression',
]);

/**
 * A remark plugin that refuses any JavaScript in the source: an import or
 * export, a `{expression}`, or an expression or spread attribute on a
 * component. Literal attributes, such as `<Callout type="warning">`, are fine.
 *
 * Compiled MDX runs as code on the server, and the admin portal compiles drafts
 * to preview them, so a body that could reach `process` or `require` would run
 * there. Content never needs it, so it fails loudly instead, naming where the
 * way the compiler's own errors do, rather than being quietly dropped.
 */
const refuseJavaScript = () => (tree: MdastNode) => {
  const check = (node: MdastNode) => {
    const attribute = node.attributes?.find(
      ({ type, value }) =>
        type !== 'mdxJsxAttribute' ||
        (value !== null && value !== undefined && typeof value !== 'string'),
    );

    if (scriptNodeTypes.has(node.type) || attribute) {
      const { start, end } = node.position!;

      throw new Error(
        'JavaScript is not allowed in content; escape a literal brace as `\\{` ' +
          `(${start.line}:${start.column}-${end.line}:${end.column})`,
      );
    }

    node.children?.forEach(check);
  };

  check(tree);
};

const prettyCode = [
  rehypePrettyCode,
  {
    theme: {
      light: 'min-light',
      dark: 'min-dark',
    },
    keepBackground: false,
  },
];

const autolinkHeadings = [
  rehypeAutolinkHeadings,
  {
    properties: {
      className: ['subheading-anchor'],
      ariaLabel: 'Link to section',
    },
  },
];

/**
 * Compile MDX, returning the rendered content along with its section headings
 * @throws when the source is not valid MDX or contains JavaScript, naming where
 */
export const compileMdx = async (
  source: string,
): Promise<{ content: React.ReactElement; headings: MdxHeading[] }> => {
  const headings: MdxHeading[] = [];
  const { default: MdxContent } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [refuseJavaScript, remarkGfm, groupImages],
    rehypePlugins: [
      rehypeSlug,
      collectHeadings(headings),
      prettyCode,
      autolinkHeadings,
    ],
  } as EvaluateOptions);

  return { content: <MdxContent components={components} />, headings };
};
