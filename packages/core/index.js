"use strict";

module.exports = {
  name: require("./package.json").name,
  included: function (/* app */) {
    this._super.included.apply(this, arguments);
  },
};
