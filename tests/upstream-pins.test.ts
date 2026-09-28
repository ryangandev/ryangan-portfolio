import { existsSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';

import semver from 'semver';
import { describe, expect, it } from 'vitest';

/**
 * Tripwires for the workarounds in "Pinned versions" (docs/architecture.md).
 *
 * Each one waits on an upstream release, and nothing else would say when that
 * release has landed. These read what is actually installed, so the update
 * that makes a workaround unnecessary fails here, in its own pull request,
 * with a message saying what to remove.
 */

const root = path.resolve(import.meta.dirname, '..');

type PackageJson = {
  version: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

/**
 * Find a package the way Node would from inside another one. Under pnpm a
 * dependency's own dependencies sit beside it, not in the root node_modules.
 *
 * @returns the package's real directory, so it can be searched from in turn,
 *          and its package.json
 */
const findPackage = (
  name: string,
  from: string = root,
): { dir: string; pkg: PackageJson } => {
  for (let dir = from; ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, 'node_modules', name);
    const manifest = path.join(candidate, 'package.json');

    if (existsSync(manifest)) {
      return {
        dir: realpathSync(candidate),
        pkg: JSON.parse(readFileSync(manifest, 'utf8')),
      };
    }

    if (dir === path.dirname(dir)) {
      throw new Error(`${name} is not installed`);
    }
  }
};

/** The `overrides` block of pnpm-workspace.yaml, as name to range. */
const readOverrides = (): Record<string, string> => {
  const yaml = readFileSync(path.join(root, 'pnpm-workspace.yaml'), 'utf8');
  const block = yaml.split(/^overrides:\n/m)[1]?.split(/\n\S/)[0] ?? '';

  return Object.fromEntries(
    [...block.matchAll(/^ {2}'?([^':\s]+)'?: (\S+)$/gm)].map(([, n, r]) => [
      n,
      r,
    ]),
  );
};

const nextConfig = findPackage('eslint-config-next').dir;

describe('ESLint 10 workarounds', () => {
  it.each([
    'eslint-plugin-react',
    'eslint-plugin-import',
    'eslint-plugin-jsx-a11y',
  ])('%s has not declared ESLint 10 yet', (plugin) => {
    const { version, peerDependencies } = findPackage(plugin, nextConfig).pkg;
    const extra =
      plugin === 'eslint-plugin-react'
        ? ", and try `version: 'detect'` in eslint.config.mjs"
        : '';

    expect(
      semver.intersects(peerDependencies?.eslint ?? '*', '^10.0.0'),
      `${plugin} ${version} now accepts ESLint 10: remove its peerDependencyRules entry in pnpm-workspace.yaml${extra}`,
    ).toBe(false);
  });
});

describe('Prisma CLI overrides', () => {
  const prisma = findPackage('prisma');
  const declaredBy: Record<string, PackageJson> = {
    // Where each overridden package is declared inside Prisma's CLI.
    'deepmerge-ts': findPackage('@prisma/config', prisma.dir).pkg,
    mysql2: prisma.pkg,
  };

  it.each(Object.entries(readOverrides()))(
    '%s is still pinned below %s',
    (name, override) => {
      const declarer = declaredBy[name];

      expect(declarer, `no known declarer for override ${name}`).toBeDefined();

      const declared = declarer.dependencies?.[name];
      const fixed = semver.minVersion(override)!;

      expect(
        declared !== undefined &&
          semver.gte(semver.minVersion(declared)!, fixed),
        `Prisma now declares ${name}@${declared}, at or past the fix: remove its override in pnpm-workspace.yaml`,
      ).toBe(false);
    },
  );
});

describe('TypeScript pin', () => {
  it('typescript-eslint does not support TypeScript 7 yet', () => {
    const { version, peerDependencies } = findPackage(
      'typescript-eslint',
      nextConfig,
    ).pkg;

    expect(
      semver.intersects(peerDependencies?.typescript ?? '*', '>=7.0.0'),
      `typescript-eslint ${version} supports TypeScript 7: lift the pin in package.json and the TypeScript ignore in .github/dependabot.yml`,
    ).toBe(false);
  });
});
