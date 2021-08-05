"use strict";

// eslint-disable-next-line node/no-unpublished-require
const EngineAddon = require("ember-engines/lib/engine-addon");

/* eslint-disable ember/avoid-leaking-state-in-ember-objects */
module.exports = EngineAddon.extend({
  name: require("./package.json").name,
  lazyLoading: false,

  included(...args) {
    this._super.included.apply(this, args);

    this.import("node_modules/prismjs/themes/prism.css");
  },
});
