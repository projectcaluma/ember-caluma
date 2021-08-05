"use strict";

// eslint-disable-next-line node/no-unpublished-require
const funnel = require("broccoli-funnel");
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

  app.import("../../node_modules/typeface-oxygen/index.css");
  app.import("../../node_modules/typeface-oxygen-mono/index.css");

  const oxygen = funnel("../../node_modules/typeface-oxygen/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/",
  });

  const oxygenMono = funnel("../../node_modules/typeface-oxygen-mono/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/",
  });

  return app.toTree([oxygen, oxygenMono]);
};
