const path = require('path');

// See https://nextjs.org/docs/pages/building-your-application/configuring/eslint#lint-staged
const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

module.exports = {
  '*.{ts,tsx}': [() => 'tsc --skipLibCheck --noEmit'],
  '*.{js,jsx,ts,tsx}': ['prettier --write', buildEslintCommand],
  '*.{json,md}': ['prettier --write'],
};

// module.exports = {
//   'src/**/*.{js,ts,jsx,tsx}': [
//     'eslint --cache --cache-location .next/cache/eslint/ --fix',
//   ],
//   'src/**/*.{json,css,scss,jsx,tsx,js,ts}': ['yarn format'],
//   'src/**/*.{ts,tsx}': () => ['npm run typecheck'],
// };
