module.exports = {
  env: {
    browser: true,
    es6: true
  },
  parser: 'babel-eslint',
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  globals: {
    global: 'readonly',
    process: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [],
  rules: {}
};
