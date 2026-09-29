import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as prettier from 'prettier';
import { describe, expect, it } from 'vitest';

import {
  gitBlobSha,
  parseContentFile,
  serializeContentFile,
  toFormValues,
  toFrontmatter,
} from '@/lib/admin/content-file';
import { formatContentFile } from '@/lib/admin/format';
import { Collection, collectionNames, collections } from '@/lib/collections';

const contentFiles = collectionNames.flatMap((collection) =>
  fs
    .readdirSync(collections[collection].directory)
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => ({
      collection,
      slug: name.replace(/\.mdx$/, ''),
      source: fs.readFileSync(
        path.join(collections[collection].directory, name),
        'utf8',
      ),
    })),
);

/** What `pnpm format` does to an MDX file, via the Node API and the real config */
const formatLikeTheCli = async (source: string) => {
  const filepath = path.resolve('src/content/posts/fixture.mdx');

  return prettier.format(source, {
    ...(await prettier.resolveConfig(filepath)),
    filepath,
  });
};

const fixture = `---
title: "Probe"
---

Some *emphasis* and __bold__.

* item one
* item two

\`\`\`ts
const   x = {a:1,b:2}
\`\`\`

\`\`\`css
.a{color:red}
\`\`\`

\`\`\`json
{"a":1,
"b":[1,2]}
\`\`\`

<Callout type="warning" className="p-4 text-sm mt-2">
  Hello   there
</Callout>

| a | b |
|---|---|
| 1 | 2 |
`;

describe('content files', () => {
  it.each(contentFiles)(
    'writes $collection/$slug back exactly as it is in the repository',
    async ({ collection, slug, source }) => {
      const { frontmatter, body } = parseContentFile(collection, source);
      const values = toFormValues(collection, slug, frontmatter, body);
      const written = serializeContentFile(
        collection,
        toFrontmatter(collection, values),
        values.body,
      );

      expect(await formatContentFile(written)).toBe(source);
    },
  );

  it('formats MDX exactly as the Prettier CLI does, embedded code included', async () => {
    const formatted = await formatContentFile(fixture);

    expect(formatted).toBe(await formatLikeTheCli(fixture));
    // Proves the embedded languages were formatted rather than skipped.
    expect(formatted).toContain('const x = { a: 1, b: 2 };');
  });

  it('writes flow-style frontmatter in schema order and drops empty links', async () => {
    const written = serializeContentFile(
      'projects',
      toFrontmatter('projects', {
        slug: 'demo',
        title: "Ryan's demo",
        date: '2026-09-28',
        featured: true,
        role: 'Developer',
        summary: 'A demo',
        thumbnailUrl: 'https://ik.imagekit.io/ryangan/demo.png',
        techStack: ['react', 'typescript'],
        link: { github: '', live: '' },
        body: '\n## Hello\n\n',
      }),
      '\n## Hello\n\n',
    );

    expect(await formatContentFile(written)).toBe(`---
title: "Ryan's demo"
date: '2026-09-28'
featured: true
role: 'Developer'
summary: 'A demo'
thumbnailUrl: 'https://ik.imagekit.io/ryangan/demo.png'
techStack: ['react', 'typescript']
---

## Hello
`);
  });

  it('keeps one link when only one is filled in', () => {
    const values = toFormValues(
      'projects',
      'grapple-grub',
      parseContentFile(
        'projects',
        contentFiles.find(({ slug }) => slug === 'grapple-grub')!.source,
      ).frontmatter,
      '',
    );

    expect(values.link).toEqual({
      github: '',
      live: 'https://michael-anderson.itch.io/grapple-grub',
    });
    expect(toFrontmatter('projects', values).link).toEqual({
      github: undefined,
      live: 'https://michael-anderson.itch.io/grapple-grub',
    });
  });

  it('rejects frontmatter the build would reject', () => {
    expect(() =>
      parseContentFile('posts' as Collection, '---\ntitle: Only\n---\n'),
    ).toThrow(/author/);
  });
});

describe('gitBlobSha', () => {
  it('matches the id Git gives the same contents', () => {
    const content = contentFiles[0].source;
    const expected = execFileSync('git', ['hash-object', '--stdin'], {
      input: content,
    })
      .toString()
      .trim();

    expect(gitBlobSha(content)).toBe(expected);
    expect(gitBlobSha('héllo\n')).toBe(
      execFileSync('git', ['hash-object', '--stdin'], { input: 'héllo\n' })
        .toString()
        .trim(),
    );
  });
});
