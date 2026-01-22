"use strict";

module.exports = {
  extends: ["recommended"],
  rules: {
    "no-bare-strings": true,
    "no-at-ember-render-modifiers": "warn",
  },
  overrides: [
    {
      files: ["**/-ember-caluma/**/*", "**/tests/**/*"],
      rules: {
        "no-bare-strings": false,
      },
    },
  ],
};
