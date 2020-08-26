"use strict";

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: ["ember", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:ember/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
  },
  rules: {
    "ember/no-jquery": "error",
    // TODO: https://github.com/projectcaluma/ember-caluma/issues/529
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
    "ember/no-observers": "warn",
    // TODO: This needs to be done seperately
    "ember/no-get": "warn",
  },
  overrides: [
    // node files
    {
      files: [
        ".eslintrc.js",
        ".template-lintrc.js",
        "ember-cli-build.js",
        "fetch-fragment-types.js",
        "index.js",
        "testem*.js",
        "blueprints/*/index.js",
        "config/**/*.js",
        "tests/dummy/config/**/*.js",
      ],
      excludedFiles: [
        "addon/**",
        "addon-test-support/**",
        "app/**",
        "tests/dummy/app/**",
        "tests/dummy/mirage/**",
      ],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ["node"],
      rules: Object.assign(
        {},
        require("eslint-plugin-node").configs.recommended.rules,
        {
          // add your custom rules and overrides for node files here
          "prefer-const": ["error"],
        }
      ),
    },
  ],
};
