"use strict";

const Funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");
const path = require("path");

/* eslint-disable node/no-unpublished-require */
const EngineAddon = require("ember-engines/lib/engine-addon");

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
module.exports = EngineAddon.extend({
  name: "ember-caluma",
  lazyLoading: false,

  // see https://github.com/dfreeman/ember-cli-node-assets/issues/11
  // for why this is not wrapped in `options`
  babel: {
    // Use babel 7 plugins with ember-cli-babel 7.x as soon as
    // https://github.com/ef4/ember-auto-import/issues/119 is resolved
    plugins: ["transform-decorators-legacy", "transform-object-rest-spread"]
  },

  included() {
    this._super.included.apply(this, arguments);
  },

  treeForApp(appTree) {
    const trees = [appTree];

    const mirageDir = path.join(__dirname, "addon-mirage-support");

    const mirageTree = new Funnel(mirageDir, {
      destDir: "mirage"
    });

    trees.push(mirageTree);

    return mergeTrees(trees);
  }
});
