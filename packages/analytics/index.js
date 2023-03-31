"use strict";

// eslint-disable-next-line n/no-unpublished-require
const { buildEngine } = require("ember-engines/lib/engine-addon");

module.exports = buildEngine({
  name: require("./package").name,

  lazyLoading: {
    enabled: false,
  },

  included(...args) {
    const app = this._findHost(this);

    app.options["ember-validated-form"] = { theme: "uikit" };

    this._super.included.apply(this, args);
  },
});
