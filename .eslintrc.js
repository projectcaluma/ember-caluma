"use strict";

module.exports = {
  extends: "@adfinis-sygroup/eslint-config/ember-addon",
  rules: {
    "ember/no-jquery": "error",
    // TODO: https://github.com/projectcaluma/ember-caluma/issues/529
    "ember/no-mixins": "warn",
    "ember/no-new-mixins": "warn",
    "ember/no-observers": "warn",
    // TODO: This needs to be done seperately
    "ember/no-get": "warn",
  },
  settings: {
    "import/internal-regex": "^ember-caluma/",
  },
  overrides: [
    ...require("@adfinis-sygroup/eslint-config/ember-addon").overrides,
    {
      files: ["fetch-fragment-types.js", "testem.browserstack.js"],
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
        { "prefer-const": ["error"] }
      ),
    },
  ],
};
