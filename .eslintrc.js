module.exports = {
  root: true,
  env: {
    node: true,
    "vue/setup-compiler-macros": true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "quotes": [0, "always"] ,
    "quote-props":[0, "always"],
    "semi": [0, "always"],
    "no-multiple-empty-lines": "off",
    "no-extra-semi": [2], // 禁止不必要的分号
    "comma-dangle": [0, "always"], // 禁止末尾逗号
    "prettier/prettier": [
      "off",
      {
        singleQuote: true
      }
    ],
    "vue/multi-word-component-names": "off",
  },
};
