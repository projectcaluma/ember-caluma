"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "ember-cli-mirage" },
      ],
    }).then(() => this.addPackagesToProject([{ name: "faker" }]));
  },
};
