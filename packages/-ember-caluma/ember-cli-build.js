"use strict";

const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    snippetPaths: ["app/snippets"],
    "ember-cli-addon-docs": {
      documentingAddonAt: "../form",
    },
    "ember-fetch": {
      nativePromise: true,
    },
  });

  return app.toTree();
};
