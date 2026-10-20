import minDark from 'shiki/themes/min-dark.mjs';
import minLight from 'shiki/themes/min-light.mjs';
import type { ThemeRegistrationRaw } from 'shiki';

/**
 * The comment greys, which are `color-level-5`'s: neutral-500 on white, 4.7:1,
 * and oklch(63% 0 0) on the dark 10% background, 5.0:1. The themes' own,
 * #c2c3c5 and #6b737c, are 1.8:1 and 3.6:1, too faint to read.
 */
export const commentColors = { light: '#737373', dark: '#898989' };

/**
 * Recolor a theme's comments, leaving every other token as it was. It is
 * renamed so shiki, which caches themes by name, never serves the original.
 */
const withCommentColor = (
  theme: ThemeRegistrationRaw,
  foreground: string,
): ThemeRegistrationRaw => ({
  ...theme,
  name: `${theme.name}-readable-comments`,
  tokenColors: theme.tokenColors?.map((rule) =>
    [rule.scope].flat().includes('comment')
      ? { ...rule, settings: { ...rule.settings, foreground } }
      : rule,
  ),
});

/** The code block themes for rehype-pretty-code */
export const codeThemes = {
  light: withCommentColor(minLight, commentColors.light),
  dark: withCommentColor(minDark, commentColors.dark),
};
