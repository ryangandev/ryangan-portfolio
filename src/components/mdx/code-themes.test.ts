import { describe, expect, it } from 'vitest';

import { codeThemes, commentColors } from '@/components/mdx/code-themes';

/** WCAG relative luminance of a #rrggbb color */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const channel = parseInt(hex.slice(i, i + 2), 16) / 255;

    return channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);

  return (lighter + 0.05) / (darker + 0.05);
};

// Code blocks have no background of their own (`keepBackground: false`), so
// comments sit on the page: white, and `--background`'s 10% grey in dark mode.
const backgrounds = { light: '#ffffff', dark: '#1a1a1a' };

describe('codeThemes', () => {
  it.each(['light', 'dark'] as const)(
    'gives %s comments 4.5:1 on the page',
    (theme) => {
      const comment = codeThemes[theme].tokenColors?.find((rule) =>
        [rule.scope].flat().includes('comment'),
      );

      expect(comment?.settings.foreground).toBe(commentColors[theme]);
      expect(
        contrast(commentColors[theme], backgrounds[theme]),
      ).toBeGreaterThanOrEqual(4.5);
    },
  );
});
