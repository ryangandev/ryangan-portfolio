import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier/flat';

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
]);
