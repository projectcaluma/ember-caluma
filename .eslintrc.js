"use strict";

module.exports = {
  extends: "@adfinis-sygroup/eslint-config/ember-addon",
  rules: {
    // TODO: https://github.com/projectcaluma/ember-caluma/issues/529
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
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
        "@graphql-eslint/selection-set-depth": "off",
      },
    },
    // Typescript
    {
      files: ["./packages/form/**/*.ts"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        tsconfigRootDir: "./packages/form",
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "@adfinis-sygroup/eslint-config/ember-addon",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      rules: {
        "@typescript-eslint/no-inferrable-types": [
          "error",
          {
            // allow function(foo: string = "bar") {}
            ignoreParameters: true,
            // allow { foo: string = "bar" }
            ignoreProperties: true,
          },
        ],
        // @ember/types heavily relies on `any`
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-call": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
      },
    },
  ],
};
