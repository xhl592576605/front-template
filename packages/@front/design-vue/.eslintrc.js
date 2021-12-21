module.exports = {
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    'airbnb-base'],
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  // parser: 'vue-eslint-parser',
  rules: {
    // 自己写一些想配置的规则
    semi: 'off',
    quotes: ['error', 'single'],
    indent: 2,
    camelcase: 2,
    'comma-dangle': 'off',
    'no-console': 'off',
    'no-nested-ternary': 'off',
    'no-bitwise': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',
    'import/no-named-default': 'off',
    'func-names': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'consistent-return': 'off',
    'vue/multi-word-component-names': 'off'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // 这里写覆盖vue文件的规则
        'vue/valid-define-props': 'off',
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
};
