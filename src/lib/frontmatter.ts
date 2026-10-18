import { parse } from 'yaml';

/**
 * The `---` fences around the frontmatter, the line ending after the closing
 * one, and whatever lies between, which may be nothing
 */
const frontmatterPattern =
  /^\uFEFF?---\r?\n(?:([\s\S]*?)\r?\n)?---[ \t]*(?:\r?\n|$)/;

/**
 * Split a content file into its YAML frontmatter and its body.
 *
 * YAML 1.2, so an unquoted `2023-03-20` stays the string it looks like rather
 * than becoming a Date. A file with no frontmatter is all body.
 * @throws when the frontmatter is not valid YAML
 */
export const parseFrontmatter = (
  source: string,
): { data: unknown; content: string } => {
  const match = frontmatterPattern.exec(source);

  if (!match) {
    return { data: {}, content: source.replace(/^\uFEFF/, '') };
  }

  return {
    data: parse(match[1] ?? '') ?? {},
    content: source.slice(match[0].length),
  };
};
