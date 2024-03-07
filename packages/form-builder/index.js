"use strict";

// eslint-disable-next-line n/no-unpublished-require
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

  options: {
    babel: {
      plugins: [
        require.resolve("ember-concurrency/async-arrow-task-transform"),
      ],
    },
  },
});
