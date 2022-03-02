"use strict";
const { buildEngine } = require("ember-engines/lib/engine-addon");

module.exports = buildEngine({
  name: require("./package").name,
  lazyLoading: {
    enabled: false,
  },
  include: function () {
    this._super.included.apply(this, arguments);
  },
});
