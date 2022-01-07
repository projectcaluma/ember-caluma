"use strict";

module.exports = {
  extends: "@adfinis-sygroup/eslint-config/ember-addon",
  settings: {
    "import/internal-regex": "^(@projectcaluma|ember-caluma)/",
  },
  overrides: [
    // Customization for workspace
    {
      files: [
        "./release.config.js",
        "./config/*.js",
        "./packages/*/ember-cli-build.js",
        "./packages/*/index.js",
        "./packages/*/testem.js",
        "./packages/*/blueprints/**/index.js",
        "./packages/*/config/**/*.js",
        "./packages/*/tests/dummy/config/**/*.js",
      ],
      parserOptions: {
        sourceType: "script",
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ["node"],
      extends: ["plugin:node/recommended"],
    },
    // GraphQL
    {
      files: ["*.graphql"],
      excludedFiles: "./packages/testing/addon/mirage-graphql/schema.graphql",
      extends: "plugin:@graphql-eslint/operations-recommended",
      parserOptions: {
        operations: "./packages/**/addon/gql/**/*.graphql",
        schema: "./packages/testing/addon/mirage-graphql/schema.graphql",
      },
      rules: {
        "@graphql-eslint/selection-set-depth": ["off"],
      },
    },
  ],
};
