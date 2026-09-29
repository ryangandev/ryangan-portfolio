/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      // MDX content is also formatted at runtime, when the admin portal saves a
      // post or project (`src/lib/admin/format.ts`). That uses Prettier's
      // standalone build, which cannot run the Tailwind plugin: the plugin
      // reads the stylesheet and its imports from disk. Sorting classes in MDX
      // here would let a file saved from the portal fail `format:check`.
      files: '*',
      excludeFiles: '*.mdx',
      options: {
        plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
        // Tailwind v4 has no JS config; the plugin reads the theme from the
        // CSS entry.
        tailwindStylesheet: './src/styles/globals.css',
      },
    },
  ],
};
