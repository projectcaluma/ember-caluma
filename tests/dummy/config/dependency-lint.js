"use strict";

module.exports = {
  generateTests: false,
  allowedVersions: {
    // https://github.com/jasonmit/ember-cli-moment-shim/issues/183
    moment: "2.24.0",

    // ember-changeset-validations hasn't updated yet
    "ember-get-config": "0.2.4 || ^0.3.0",

    // ember-cli-mirage hasn't updated yet
    "ember-inflector": "3.0.1 || ^4.0.1",
  },
};
