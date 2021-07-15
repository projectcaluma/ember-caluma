"use strict";

const path = require("path");

const Funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");
// eslint-disable-next-line node/no-unpublished-require
const EngineAddon = require("ember-engines/lib/engine-addon");

const DEFAULT_OPTIONS = {
  includeMirageConfig: true,
  includeProxyPolyfill: true,
  includeIntersectionObserverPolyfill: true,
};

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
module.exports = EngineAddon.extend({
  name: require("./package.json").name,
  lazyLoading: false,

  // see https://github.com/dfreeman/ember-cli-node-assets/issues/11
  // for why this is not wrapped in `options`
  babel: {
    plugins: ["@babel/plugin-proposal-object-rest-spread"],
  },

  _getOptions() {
    const app = this._findHost();

    return Object.assign({}, DEFAULT_OPTIONS, app.options["ember-caluma"]);
  },

  included(...args) {
    this._super.included.apply(this, args);

    this.import("node_modules/prismjs/themes/prism.css");

    if (this._getOptions().includeProxyPolyfill) {
      this.import("node_modules/proxy-polyfill/proxy.min.js");
    }

    if (this._getOptions().includeIntersectionObserverPolyfill) {
      this.import(
        "node_modules/intersection-observer/intersection-observer.js"
      );
    }
  },

  treeForApp(appTree) {
    const trees = [appTree];

    const app = this._findHost();

    if (
      this._getOptions().includeMirageConfig &&
      app.registry.availablePlugins["ember-cli-mirage"]
    ) {
      const mirageDir = path.join(__dirname, "addon-mirage-support");

      const mirageTree = new Funnel(mirageDir, {
        destDir: "mirage",
      });

      trees.push(mirageTree);
    }

    return mergeTrees(trees);
  },
});
