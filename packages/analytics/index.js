"use strict";

module.exports = {
  name: require("./package").name,
  included(...args) {
    this._super.included.apply(this, args);
  },
};
