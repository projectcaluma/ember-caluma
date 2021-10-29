"use strict";

// eslint-disable-next-line node/no-unpublished-require
const { buildEngine } = require("ember-engines/lib/engine-addon");

const ioniconsBase = require
  .resolve("ionicons")
  .split("/")
  .slice(0, -1)
  .join("/");

module.exports = buildEngine({
  name: require("./package").name,

  lazyLoading: {
    enabled: false,
  },

  svgJar: {
    sourceDirs: [`${ioniconsBase}/svg`],
  },
});
