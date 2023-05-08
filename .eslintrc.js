module.exports = {
  root: true,
  env: {
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 6,//也就是ES6语法支持的意思
    sourceType: "module",
    ecmaFeatures: {
      modules: true
    }
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    semi: ["error", "never"]
  }
}