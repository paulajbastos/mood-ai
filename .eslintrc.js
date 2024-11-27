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
