"use strict";

module.exports = function (environment) {
  return {
    modulePrefix: require("../package.json").name,
    environment,

    analytics: {
      functionChoices: ["VALUE", "SUM", "COUNT", "AVG", "MAX", "MIN"],
    },
  };
};
