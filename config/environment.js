"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: "ember-caluma",
    environment,

    "ember-validated-form": {
      theme: "uikit",
      defaults: {
        label: "cfb-label",
      },
    },

    moment: {
      includeLocales: true,
    },
  };

  return ENV;
};
