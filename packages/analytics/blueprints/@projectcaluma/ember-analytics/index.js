"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "ember-engines" },
        { name: "ember-composable-helpers" },
        { name: "ember-power-select" },
      ],
    });
  },
};
