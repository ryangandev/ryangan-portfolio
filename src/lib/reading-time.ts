/**
 * Average adult reading speed for prose. The usual range quoted for
 * comprehension (rather than skimming) is 200-250 wpm.
 */
const WORDS_PER_MINUTE = 220;

/**
 * Code samples are skimmed line by line rather than read word by word, so they
 * get their own rate. Counting their tokens as prose badly overstates a
 * code-heavy post, since code runs to many more short tokens per line.
 *
 * Calibrated so the existing posts land on what a plain word count would give
 * (2 and 9 minutes); the two only diverge once a post is mostly code.
 */
const CODE_LINES_PER_MINUTE = 40;

const FENCED_CODE = /^ {0,3}```[\s\S]*?^ {0,3}```/gm;

/**
 * Estimate how long a post takes to read
 * @param content raw MDX body, with frontmatter already stripped
 * @returns Whole minutes, never less than 1
 */
export const getReadingTime = (content: string): number => {
  const codeLines = (content.match(FENCED_CODE) ?? []).reduce(
    // The two fence lines are not content.
    (total, block) => total + Math.max(0, block.split('\n').length - 2),
    0,
  );

  const words = content
    .replace(FENCED_CODE, '')
    .replace(/`[^`]*`/g, '') // inline code
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links and images keep their label
    .replace(/<[^>]+>/g, ' ') // JSX and HTML tags
    .replace(/[#>*_~|]/g, ' ') // markdown punctuation
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = words / WORDS_PER_MINUTE + codeLines / CODE_LINES_PER_MINUTE;

  return Math.max(1, Math.round(minutes));
};
