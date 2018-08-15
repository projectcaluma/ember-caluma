"use strict";

/* eslint-disable node/no-unpublished-require */
const EngineAddon = require("ember-engines/lib/engine-addon");

module.exports = EngineAddon.extend({
  name: "ember-caluma-form-builder",
  lazyLoading: true,

  included() {
    this._super.included.apply(this, arguments);
  }
});
