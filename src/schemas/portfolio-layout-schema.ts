import { z } from 'zod';

/**
 * How the portfolio is laid out, chosen in the admin portal and stored in
 * `src/data/portfolio-layout.json`. Strict, so a misspelled key in the file
 * fails the build rather than quietly falling back to a default.
 */
export const PortfolioLayoutSchema = z.strictObject({
  /** The portfolio list: timeline rows with or without a thumbnail each */
  list: z.enum(['thumbnails', 'timeline']),
  /** A project's tech stack: brand icons with labels, or plain badges */
  stack: z.enum(['icons', 'badges']),
});

export type PortfolioLayout = z.infer<typeof PortfolioLayoutSchema>;
