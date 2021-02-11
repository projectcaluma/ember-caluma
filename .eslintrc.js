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
    "ember/no-classic-components": "warn",
    "ember/no-classic-classes": "warn",
    "ember/require-tagless-components": "warn",
    "ember/no-actions-hash": "warn",
    "ember/no-component-lifecycle-hooks": "warn",
  },
  settings: {
    "import/internal-regex": "^ember-caluma/",
  },
  overrides: [
    ...require("@adfinis-sygroup/eslint-config/ember-addon").overrides,
    {
      files: ["bin/*.js", "testem*.js"],
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
