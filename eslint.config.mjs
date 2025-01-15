import adfinisEmberAddonConfig from "@adfinis/eslint-config/ember-addon";
import graphql from "@graphql-eslint/eslint-plugin";
import ember from "eslint-plugin-ember";
import n from "eslint-plugin-n";
import globals from "globals";

export default [
  ...adfinisEmberAddonConfig,
  {
    ignores: [
      "**/blueprints/*/files/",
      // compiled output
      "**/dist/",
      // misc
      "**/coverage/",
      // ember-try
      "**/.node_modules.ember-try/",
      // ember-cli-addon-docs
      "packages/-ember-caluma/app/snippets/",
    ],
  },
  {
    plugins: { ember },
    settings: {
      "import/internal-regex": "^(@projectcaluma|ember-caluma|dummy)/",
    },
    rules: {
      // TODO: Migrate as suggested here:
      // https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-runloop.md
      "ember/no-runloop": "warn",
    },
  },
  // Customization for workspace
  {
    files: [
      "config/*.js",
      "packages/*/ember-cli-build.js",
      "packages/*/index.js",
      "packages/*/testem.js",
      "packages/*/blueprints/**/index.js",
      "packages/*/config/**/*.js",
      "packages/*/tests/dummy/config/**/*.js",
    ],
    plugins: { n },
    languageOptions: {
      sourceType: "script",
      ecmaVersion: "latest",
      globals: {
        ...globals.node,
      },
    },
  },
  // GraphQL
  {
    files: ["*.graphql"],
    plugins: { "@graphql-eslint": graphql },
    languageOptions: {
      parser: graphql.parser,
      parserOptions: {
        operations: "./packages/**/addon/gql/**/*.graphql",
        schema: "./packages/testing/addon/mirage-graphql/schema.graphql",
      },
    },
    rules: {
      ...graphql.configs["flat/operations-recommended"].rules,
      "@graphql-eslint/selection-set-depth": ["off"],
    },
  },
  // Mirage
  {
    files: [
      "./packages/*/tests/**/*.js",
      "./packages/testing/addon/mirage-graphql/**/*.js",
    ],
    rules: {
      "ember/no-array-prototype-extensions": ["off"],
    },
  },
];
