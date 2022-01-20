"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "ember-composable-helpers" },
        { name: "ember-truth-helpers" },
      ],
    });
  },
};
