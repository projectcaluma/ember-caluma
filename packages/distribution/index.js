"use strict";

const { buildEngine } = require("ember-engines/lib/engine-addon");

const publicAssets = [
  ...require.resolve("./package").split("/").slice(0, -1),
  "public",
  "assets",
].join("/");

module.exports = buildEngine({
  name: require("./package").name,
  lazyLoading: { enabled: false },
  svgJar: { sourceDirs: [publicAssets] },

  babel: {
    plugins: [require.resolve("ember-concurrency/async-arrow-task-transform")],
  },
});
