"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [{ name: "ember-cli-mirage" }],
    }).then(() => this.addPackagesToProject([{ name: "faker" }]));
  },
};
