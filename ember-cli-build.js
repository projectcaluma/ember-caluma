"use strict";

const EmberAddon = require("ember-cli/lib/broccoli/ember-addon");
const funnel = require("broccoli-funnel");
const sass = require("sass");

module.exports = function (defaults) {
  const app = new EmberAddon(defaults, {
    sassOptions: { implementation: sass },
    snippetPaths: ["tests/dummy/app/snippets"],
    babel: {
      plugins: ["@babel/plugin-proposal-object-rest-spread"],
    },
  });

  app.import("node_modules/typeface-oxygen/index.css");
  app.import("node_modules/typeface-oxygen-mono/index.css");

  const oxygen = funnel("node_modules/typeface-oxygen/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/",
  });

  const oxygenMono = funnel("node_modules/typeface-oxygen-mono/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/",
  });

  return app.toTree([oxygen, oxygenMono]);
};
