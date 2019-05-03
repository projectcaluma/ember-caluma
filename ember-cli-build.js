"use strict";

const EmberAddon = require("ember-cli/lib/broccoli/ember-addon");
const funnel = require("broccoli-funnel");
const sass = require("sass");

module.exports = function(defaults) {
  const app = new EmberAddon(defaults, {
    sassOptions: { implementation: sass },
    snippetPaths: ["tests/dummy/app/snippets"],
    babel: {
      plugins: [
        ["@babel/plugin-proposal-decorators", { legacy: true }],
        "@babel/plugin-proposal-object-rest-spread"
      ]
    }
  });

  app.import("node_modules/moment/locale/de.js");
  app.import("node_modules/moment/locale/de-ch.js");
  app.import("node_modules/moment/locale/it.js");
  app.import("node_modules/moment/locale/it-ch.js");
  app.import("node_modules/moment/locale/fr.js");
  app.import("node_modules/moment/locale/fr-ch.js");

  app.import("node_modules/typeface-oxygen/index.css");
  app.import("node_modules/typeface-oxygen-mono/index.css");

  const oxygen = funnel("node_modules/typeface-oxygen/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/"
  });

  const oxygenMono = funnel("node_modules/typeface-oxygen-mono/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/"
  });

  return app.toTree([oxygen, oxygenMono]);
};
