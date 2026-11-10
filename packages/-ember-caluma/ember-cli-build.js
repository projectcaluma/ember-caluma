"use strict";

const sideWatch = require("@embroider/broccoli-side-watch");
const EmberApp = require("ember-cli/lib/broccoli/ember-app");

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    trees: {
      app: sideWatch("app", {
        watching: [
          "../analytics",
          "../core",
          "../distribution",
          "../form",
          "../form-builder",
          "../testing",
          "../workflow",
        ],
      }),
    },
    snippetPaths: ["app/snippets"],
    "ember-cli-addon-docs": {
      documentingAddonAt: "../form",
    },
  });

  return app.toTree();
};
