/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    'simple-import-sort',
    'sort-keys-custom-order-fix',
    'unused-imports',
    'typescript-sort-keys',
  ],
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['PascalCase'],
        prefix: ['I'],
        selector: 'interface',
      },
      {
        format: ['PascalCase'],
        prefix: ['T'],
        selector: 'typeAlias',
      },
      {
        format: ['camelCase'],
        selector: ['variable'],
      },
      {
        format: ['camelCase'],
        selector: ['variable'],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            message:
              "To reduce bundle size, import only the required lodash function. Example: import get from 'lodash/get'",
            name: 'lodash',
          },
        ],
      },
    ],
    'object-shorthand': ['error', 'always'],
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',
    'sort-keys-custom-order-fix/sort-keys-custom-order-fix': [
      'error',
      'custom',
      {
        caseSensitive: true,
        natural: true,
        orderBy: 'asc',
      },
    ],
    'typescript-sort-keys/interface': ['error', 'asc', { caseSensitive: true, natural: false, requiredFirst: false }],
    'unused-imports/no-unused-imports-ts': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
