"use strict";

const Funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");
const path = require("path");

/* eslint-disable node/no-unpublished-require */
const EngineAddon = require("ember-engines/lib/engine-addon");

const DEFAULT_OPTIONS = {
  includeMirageConfig: true
};

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
module.exports = EngineAddon.extend({
  name: require("./package.json").name,
  lazyLoading: false,

  // see https://github.com/dfreeman/ember-cli-node-assets/issues/11
  // for why this is not wrapped in `options`
  babel: {
    plugins: ["@babel/plugin-proposal-object-rest-spread"]
  },

  included() {
    this._super.included.apply(this, arguments);
  },

  treeForApp(appTree) {
    const trees = [appTree];

    const app = this._findHost();
    const addonOptions = Object.assign(
      {},
      DEFAULT_OPTIONS,
      app.options["ember-caluma"]
    );

    if (
      addonOptions.includeMirageConfig &&
      app.registry.availablePlugins["ember-cli-mirage"]
    ) {
      const mirageDir = path.join(__dirname, "addon-mirage-support");

      const mirageTree = new Funnel(mirageDir, {
        destDir: "mirage"
      });

      trees.push(mirageTree);
    }

    return mergeTrees(trees);
  }
});
