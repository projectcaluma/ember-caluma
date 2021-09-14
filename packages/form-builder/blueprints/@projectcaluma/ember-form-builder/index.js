"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "@projectcaluma/ember-form" },
        { name: "ember-engines" },
        { name: "ember-math-helpers" },
        { name: "ember-pikaday" },
        { name: "ember-power-select" },
      ],
    });
  },
};
