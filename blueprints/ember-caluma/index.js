"use strict";

module.exports = {
  normalizeEntityName() {}, // no-op since we're just adding dependencies

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "ember-engines" },
        { name: "ember-power-select" },
        { name: "ember-promise-helpers" },
        { name: "ember-math-helpers" },
        { name: "ember-cli-showdown" },
        { name: "ember-pikaday" },
        { name: "ember-composable-helpers" },
      ],
    });
  },
};
