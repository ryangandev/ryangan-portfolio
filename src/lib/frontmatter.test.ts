import { describe, expect, it } from 'vitest';

import { parseFrontmatter } from '@/lib/frontmatter';

describe('parseFrontmatter', () => {
  it('splits the frontmatter from the body, keeping the blank line after it', () => {
    expect(
      parseFrontmatter(
        "---\ntitle: 'A post'\ntopics: ['React']\n---\n\n## One\n",
      ),
    ).toEqual({
      data: { title: 'A post', topics: ['React'] },
      content: '\n## One\n',
    });
  });

  it('reads an unquoted date as the string it looks like', () => {
    expect(parseFrontmatter('---\ndate: 2024-09-20\n---\n').data).toEqual({
      date: '2024-09-20',
    });
  });

  it('reads a file saved with a byte order mark and Windows line endings', () => {
    expect(parseFrontmatter('\uFEFF---\r\ntitle: A\r\n---\r\nBody')).toEqual({
      data: { title: 'A' },
      content: 'Body',
    });
  });

  it('reads empty frontmatter as no fields', () => {
    expect(parseFrontmatter('---\n---\nBody')).toEqual({
      data: {},
      content: 'Body',
    });
  });

  it('reads a file without frontmatter as all body', () => {
    expect(parseFrontmatter('## One\n')).toEqual({
      data: {},
      content: '## One\n',
    });
  });

  it('leaves a horizontal rule in the body', () => {
    expect(parseFrontmatter('---\ntitle: A\n---\nOne\n\n---\n\nTwo')).toEqual({
      data: { title: 'A' },
      content: 'One\n\n---\n\nTwo',
    });
  });

  it('throws on invalid YAML rather than reading it as empty', () => {
    expect(() => parseFrontmatter("---\ntitle: 'unclosed\n---\n")).toThrow();
  });
});
