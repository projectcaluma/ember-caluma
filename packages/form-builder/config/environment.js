"use strict";

module.exports = function (environment) {
  return {
    modulePrefix: require("../package.json").name,
    environment,
  };
};
