/**
 * What a project runs on, which the portfolio list filters by.
 *
 * The keys are what project frontmatter lists under `platforms`, and their
 * order here is the order the filters and a project's facts show them in.
 */
export const platforms = {
  web: { label: 'Web' },
  ios: { label: 'iOS' },
  game: { label: 'Game' },
} as const;

export type PlatformName = keyof typeof platforms;

export const platformNames = Object.keys(platforms) as [
  PlatformName,
  ...PlatformName[],
];

/** Labels in the order `platforms` lists them, whatever order they came in */
export const platformLabels = (names: readonly PlatformName[]): string[] =>
  platformNames
    .filter((name) => names.includes(name))
    .map((name) => platforms[name].label);
