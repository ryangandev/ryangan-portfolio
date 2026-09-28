import { createRequire } from 'node:module';

import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

const require = createRequire(import.meta.url);

export default defineConfig([
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Prisma 7 emits the client as real source files rather than into
    // node_modules, so they have to be ignored explicitly.
    'src/generated/**',
  ]),
  ...nextCoreWebVitals,
  ...nextTypeScript,
  prettier,
  {
    settings: {
      react: {
        // eslint-plugin-react's `version: 'detect'` calls
        // `context.getFilename()`, which ESLint 10 removed, and crashes every
        // rule that checks the React version. Reading the installed version
        // here skips that path and still tracks upgrades. Revert to 'detect'
        // once a release includes jsx-eslint/eslint-plugin-react#4018.
        version: require('react/package.json').version,
      },
    },
  },
]);
