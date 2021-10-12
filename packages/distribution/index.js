"use strict";

// eslint-disable-next-line node/no-unpublished-require
const { buildEngine } = require("ember-engines/lib/engine-addon");

module.exports = buildEngine({
  name: require("./package").name,

  lazyLoading: {
    enabled: false,
  },
});
