import adfinisEmberAddonConfig from "@adfinis/eslint-config/ember-addon";
import ember from "eslint-plugin-ember";
import n from "eslint-plugin-n";
import pnpm from "eslint-plugin-pnpm";
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
      // https://github.com/ember-cli/eslint-plugin-ember/blob/master/docs/rules/no-runloop.md
      //
      // We disable this rule as we don't have any problems with it right now
      // and the suggested alternative `ember-lifeline` is not viable as it has
      // not been maintained for a while.
      "ember/no-runloop": "off",
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
  // PNPM
  ...pnpm.configs.json,
  ...pnpm.configs.yaml,
  {
    files: ["package.json", "**/package.json"],
    rules: {
      "pnpm/json-enforce-catalog": [
        "error",
        // https://github.com/embroider-build/ember-auto-import/issues/648
        { ignores: ["ember-auto-import"] },
      ],
    },
  },
  {
    files: ["pnpm-workspace.yaml"],
    rules: {
      "pnpm/yaml-no-duplicate-catalog-item": "off",
    },
  },
];
