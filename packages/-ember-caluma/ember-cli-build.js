"use strict";

// eslint-disable-next-line node/no-unpublished-require
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    snippetPaths: ["app/snippets"],
    "ember-cli-addon-docs": {
      documentingAddonAt: "../form",
    },
    "ember-cli-babel": {
      includePolyfill:
        Boolean(process.env.CI) || process.env.EMBER_ENV === "production",
    },
  });

  return app.toTree();
};
