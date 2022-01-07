"use strict";

module.exports = {
  extends: [
    "@adfinis-sygroup/semantic-release-config",
    "semantic-release-monorepo",
  ],
  branches: ["main", { name: "beta", prerelease: true }],
};
