/** @type {import('prettier').Config} */
module.exports = {
  endOfLine: 'lf',
  tabWidth: 2,
  printWidth: 80,
  useTabs: false,
  singleQuote: true,
  plugins: ['prettier-plugin-packagejson', 'prettier-plugin-tailwindcss'],
  // Tailwind v4 has no JS config; the plugin reads the theme from the CSS entry.
  tailwindStylesheet: './src/styles/globals.css',
};
