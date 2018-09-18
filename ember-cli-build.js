"use strict";

const EmberAddon = require("ember-cli/lib/broccoli/ember-addon");
const funnel = require("broccoli-funnel");
const sass = require("sass");

module.exports = function(defaults) {
  let app = new EmberAddon(defaults, {
    sassOptions: { implementation: sass },
    snippetPaths: ["tests/dummy/app/snippets"],
    babel: {
      // Use babel 7 plugins with ember-cli-babel 7.x as soon as
      // https://github.com/ef4/ember-auto-import/issues/119 is resolved
      plugins: ["transform-decorators-legacy", "transform-object-rest-spread"]
    }
  });

  app.import("node_modules/typeface-oxygen/index.css");
  app.import("node_modules/typeface-oxygen-mono/index.css");

  let oxygen = funnel("node_modules/typeface-oxygen/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/"
  });

  let oxygenMono = funnel("node_modules/typeface-oxygen-mono/files", {
    include: ["*.woff", "*.woff2"],
    destDir: "/assets/files/"
  });

  return app.toTree([oxygen, oxygenMono]);
};
