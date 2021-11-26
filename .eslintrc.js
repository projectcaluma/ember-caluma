"use strict";

module.exports = {
  extends: "@adfinis-sygroup/eslint-config/ember-addon",
  rules: {
    "ember/no-observers": "warn",
    // TODO: https://github.com/projectcaluma/ember-caluma/issues/529
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
    // TODO: Update @projectcaluma/ember-form lib layer to native classes
    "ember/no-get": "warn",
    "ember/no-classic-classes": "warn",
  },
  settings: {
    "import/internal-regex": "^(@projectcaluma|ember-caluma)/",
  },
  overrides: [
    // Customization for workspace
    {
      files: [
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
