"use strict";

module.exports = {
  extends: ["recommended", "ember-template-lint-plugin-prettier:recommended"],
  plugins: ["ember-template-lint-plugin-prettier"],
  rules: {
    "no-bare-strings": true,
    // needs to be resolved before ember v4
    "no-implicit-this": "warn",
    "no-action": "warn",
    "no-curly-component-invocation": "warn",
  },
};
