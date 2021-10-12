"use strict";

module.exports = function (environment) {
  const ENV = {
    modulePrefix: require("../package.json").name,
    environment,
  };

  return ENV;
};
