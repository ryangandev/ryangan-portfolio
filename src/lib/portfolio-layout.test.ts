import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';

import {
  portfolioLayout,
  portfolioLayoutPath,
  serializePortfolioLayout,
} from '@/lib/portfolio-layout';

describe('serializePortfolioLayout', () => {
  // The admin portal commits what this writes, so anything else would turn
  // every save into a diff of the whole file.
  it('writes the layout file byte for byte as it is in the repository', () => {
    const source = fs.readFileSync(
      path.join(process.cwd(), portfolioLayoutPath),
      'utf8',
    );

    expect(serializePortfolioLayout(portfolioLayout)).toBe(source);
  });
});
