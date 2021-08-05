"use strict";

const path = require("path");

const Funnel = require("broccoli-funnel");
const mergeTrees = require("broccoli-merge-trees");

module.exports = {
  name: require("./package").name,

  treeForApp(appTree) {
    const mirageDir = path.join(__dirname, "addon-mirage-support");

    const mirageTree = new Funnel(mirageDir, {
      destDir: "mirage",
    });

    return mergeTrees([appTree, mirageTree]);
  },
};
