module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'padding-line-between-statements': 'warn', // require a new line between statements/functions
    'newline-before-return': 'warn', // there should be a new line before calling return
    'prefer-const': 'warn', // where possible const should be used
    'no-empty': 'warn', // no block (function/if statement) should be empty
    'no-else-return': 'warn', // else returns are not required
    'prettier/prettier': 'warn', // code should be formatted to match the prettier spec
    'no-async-promise-executor': 'off',
  },
};
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'react-app',
    'react-app/jest',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'padding-line-between-statements': 'warn', // require a new line between statements/functions
    'newline-before-return': 'warn', // there should be a new line before calling return
    'prefer-const': 'warn', // where possible const should be used
    'no-empty': 'warn', // no block (function/if statement) should be empty
    'no-else-return': 'warn', // else returns are not required
    'prettier/prettier': 'warn', // code should be formatted to match the prettier spec
    'no-async-promise-executor': 'off',
  },
};
