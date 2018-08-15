"use strict";

module.exports = function(environment) {
  const ENV = {
    modulePrefix: "ember-caluma-form-builder",
    environment,

    "ember-validated-form": {
      css: {
        submit: "uk-button uk-button-primary",
        group: "uk-margin",
        help: "uk-text-danger uk-text-small"
      }
    }
  };

  return ENV;
};
