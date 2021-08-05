"use strict";

const DEFAULT_OPTIONS = {
  includeProxyPolyfill: true,
  includeIntersectionObserverPolyfill: true,
};

module.exports = {
  name: require("./package").name,

  _getOptions() {
    const app = this._findHost();

    return Object.assign({}, DEFAULT_OPTIONS, app.options["ember-caluma"]);
  },

  included(...args) {
    this._super.included.apply(this, args);

    if (this._getOptions().includeProxyPolyfill) {
      this.import("node_modules/proxy-polyfill/proxy.min.js");
    }

    if (this._getOptions().includeIntersectionObserverPolyfill) {
      this.import(
        "node_modules/intersection-observer/intersection-observer.js"
      );
    }
  },
};
