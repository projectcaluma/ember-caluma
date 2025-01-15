"use strict";

const { buildEngine } = require("ember-engines/lib/engine-addon");

module.exports = buildEngine({
  name: require("./package.json").name,

  lazyLoading: {
    enabled: false,
  },

  included(...args) {
    const app = this._findHost(this);

    app.options["ember-validated-form"] = { theme: "uikit" };

    this._super.included.apply(this, args);
  },

  babel: {
    plugins: [require.resolve("ember-concurrency/async-arrow-task-transform")],
  },
});
