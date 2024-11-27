const path = require("path");

// See https://nextjs.org/docs/pages/building-your-application/configuring/eslint#lint-staged
const buildEslintCommand = (filenames) =>
  `next lint --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;

module.exports = {
  "*.{ts,tsx}": [() => "tsc --skipLibCheck --noEmit"],
  "*.{js,jsx,ts,tsx}": ["prettier --write", buildEslintCommand],
  "*.{json,md}": ["prettier --write"],
};
