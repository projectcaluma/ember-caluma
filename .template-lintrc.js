"use strict";

module.exports = {
  extends: "recommended",

  rules: {
    "no-bare-strings": true,
    // needs to be resolved before ember v4
    "no-implicit-this": false,
    "no-action": false,
    "no-curly-component-invocation": false,
  },
};
