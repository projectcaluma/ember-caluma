"use strict";

module.exports = {
  generateTests: false,
  allowedVersions: {
    // https://github.com/jasonmit/ember-cli-moment-shim/issues/183
    moment: "2.24.0",

    // EC v3+ heavily relies on Proxy which is not supported by IE11
    "ember-changeset": "^2.2.4",
    "ember-changeset-validations": "^2.2.1",
  },
};
