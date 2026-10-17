import layoutFile from '@/data/portfolio-layout.json';
import {
  PortfolioLayout,
  PortfolioLayoutSchema,
} from '@/schemas/portfolio-layout-schema';

/** Repository-relative, as GitHub paths are, for the admin portal */
export const portfolioLayoutPath = 'src/data/portfolio-layout.json';

/**
 * The layout the site is built with. Parsed when the module loads, so an
 * invalid file fails the build.
 */
export const portfolioLayout: PortfolioLayout =
  PortfolioLayoutSchema.parse(layoutFile);

/** The file's contents for a layout, formatted as Prettier formats JSON */
export const serializePortfolioLayout = (layout: PortfolioLayout): string =>
  `${JSON.stringify(layout, null, 2)}\n`;

type Choice<T extends string> = {
  label: string;
  choices: { value: T; label: string; description: string }[];
};

/** What the admin portal offers for each setting, the default first */
export const portfolioLayoutChoices: {
  [K in keyof PortfolioLayout]: Choice<PortfolioLayout[K]>;
} = {
  list: {
    label: 'Portfolio list',
    choices: [
      {
        value: 'thumbnails',
        label: 'Timeline with thumbnails',
        description: 'Each row shows a small thumbnail beside the project.',
      },
      {
        value: 'timeline',
        label: 'Timeline',
        description:
          'Text rows only; the hovered row shows its thumbnail in the margin.',
      },
    ],
  },
  stack: {
    label: 'Tech stack on a project page',
    choices: [
      {
        value: 'icons',
        label: 'Icons',
        description: 'Each technology beside its brand icon.',
      },
      {
        value: 'badges',
        label: 'Badges',
        description: 'Each technology as a plain outlined badge.',
      },
    ],
  },
};
