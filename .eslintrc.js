module.exports = {
  globals: {
    server: true
  },
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  parser: "babel-eslint",
  plugins: ["ember", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:ember/recommended",
    "plugin:prettier/recommended"
  ],
  env: {
    browser: true
  },
  rules: {},
  overrides: [
    // node files
    {
      files: [
        ".eslintrc.js",
        ".template-lintrc.js",
        "ember-cli-build.js",
        "fetch-fragment-types.js",
        "index.js",
        "testem.js",
        "blueprints/*/index.js",
        "config/**/*.js",
        "tests/dummy/config/**/*.js"
      ],
      excludedFiles: [
        "addon/**",
        "addon-test-support/**",
        "app/**",
        "tests/dummy/app/**",
        "tests/dummy/mirage/**"
      ],
      parserOptions: {
        sourceType: "script"
      },
      env: {
        browser: false,
        node: true
      },
      plugins: ["node"],
      rules: Object.assign(
        {},
        require("eslint-plugin-node").configs.recommended.rules,
        {
          // add your custom rules and overrides for node files here
          "prefer-const": ["error"]
        }
      )
    }
  ]
};
