"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-caluma",
    environment,

    "ember-caluma": {
      powerSelectEnableSearchLimit: 10,
    },

    "ember-validated-form": {
      theme: "uikit",
      defaults: {
        label: "cfb-label",
      },
    },
  };

  return ENV;
};
