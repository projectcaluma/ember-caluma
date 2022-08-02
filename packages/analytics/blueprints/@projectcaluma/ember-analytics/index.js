"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "ember-cli-showdown" },
        { name: "ember-composable-helpers" },
        { name: "ember-math-helpers" },
        { name: "ember-pikaday" },
        { name: "ember-power-select" },
      ],
    });
  },
};
