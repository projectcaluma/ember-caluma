"use strict";

module.exports = {
  name: require("./package").name,

  included(...args) {
    const app = this._findHost(this);

    app.options.flatpickr = {
      locales: ["de", "fr"],
      theme: "airbnb",
      ...(app.options.flatpickr ?? {}),
    };

    this._super.included.apply(this, args);
  },
};
