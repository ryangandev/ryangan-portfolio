import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { expect, it } from 'vitest';

/**
 * AGENTS.md sends agents to the docs that ship with the installed Next.js,
 * since Next 16 differs from what most models were trained on. `agentRules` is
 * off in next.config.mjs, so Next no longer keeps that pointer current itself.
 * A release could move the docs, and nothing else would notice agents being
 * sent to a directory that is not there.
 */

const root = path.resolve(import.meta.dirname, '..');

it('sends agents to the Next.js docs that are installed', () => {
  const agents = readFileSync(path.join(root, 'AGENTS.md'), 'utf8');
  const docs = agents.match(/`(node_modules\/next\/[^`]+)`/)?.[1];

  expect(docs, 'AGENTS.md names the Next.js docs directory').toBeDefined();
  // The App Router guides are the ones this site needs.
  for (const entry of ['index.md', '01-app']) {
    expect(
      existsSync(path.join(root, docs!, entry)),
      `${docs}${entry} exists`,
    ).toBe(true);
  }
});
