import { format } from 'prettier/standalone';
import * as acorn from 'prettier/plugins/acorn';
import * as angular from 'prettier/plugins/angular';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import * as flow from 'prettier/plugins/flow';
import * as glimmer from 'prettier/plugins/glimmer';
import * as graphql from 'prettier/plugins/graphql';
import * as html from 'prettier/plugins/html';
import * as markdown from 'prettier/plugins/markdown';
import * as meriyah from 'prettier/plugins/meriyah';
import * as postcss from 'prettier/plugins/postcss';
import * as typescript from 'prettier/plugins/typescript';
import * as yaml from 'prettier/plugins/yaml';

import prettierConfig from '../../../prettier.config.js';

/*
 * Prettier formats the code inside fenced blocks as well as the Markdown around
 * them, so every built-in language is loaded, as the CLI does. Leaving one out
 * would leave that language's code blocks as typed, and `format:check` would
 * then fail on the saved file.
 */
const plugins = [
  acorn,
  angular,
  babel,
  estree,
  flow,
  glimmer,
  graphql,
  html,
  markdown,
  meriyah,
  postcss,
  typescript,
  yaml,
];

// The repository's own options. Its plugins are left out: the config applies
// none to MDX (see its `overrides`), and they could not load here anyway.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { plugins: _, overrides: __, ...options } = prettierConfig;

/**
 * Format an MDX file exactly as `pnpm format` would, so a file saved from the
 * admin portal passes `format:check` in CI.
 *
 * This is Prettier's standalone build rather than its Node API. The Node API
 * finds the config file and its plugins on disk at runtime, and a deployed
 * serverless function only contains the files its imports reach.
 */
export const formatContentFile = (source: string): Promise<string> =>
  format(source, { ...options, parser: 'mdx', plugins });
