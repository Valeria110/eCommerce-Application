module.exports = {
  ignorePatterns: ['.eslintrc.js'],
  parser: '@typescript-eslint/parser',
  plugins: ['prettier', 'import', '@typescript-eslint'],
  extends: [
    'plugin:prettier/recommended',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'airbnb-typescript/base',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  rules: {
    'no-debugger': 'off',
    'no-console': 0,
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-explicit-any': 2,
  },
};
