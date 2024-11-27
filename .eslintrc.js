module.exports = {
  extends: ['next/core-web-vitals', 'next/typescript'],
  rules: {
    'no-console': ['warn', { allow: ['error'] }],
    'import/no-anonymous-default-export': [
      2,
      {
        allowObject: true,
        allowArray: true,
      },
    ],
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        warnOnUnassignedImports: true,
      },
    ],
  },
};

// {
//   "extends": ["next/core-web-vitals", "prettier"],
//   "plugins": ["prettier", "simple-import-sort"],
//   "rules": {
//     "prettier/prettier": ["error"],
//     "simple-import-sort/exports": "error",
//     "simple-import-sort/imports": [
//       "error",
//       {
//         "groups": [["^@?\\w"], ["^\\."]]
//       }
//     ]
//   }
// }
