"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    /**
     * Automatically install all ember addons that expose helpers / components
     * used in templates of the addon itself. Other dependencies that are only
     * used in JS code don't need to be installed in the host app and therefore
     * don't have to be included here.
     */
    return this.addAddonsToProject({
      packages: [
        { name: "@projectcaluma/ember-core" },
        { name: "ember-autoresize-modifier" },
        { name: "ember-cli-showdown" },
        { name: "ember-composable-helpers" },
        { name: "ember-concurrency" },
        { name: "ember-flatpickr" },
        { name: "ember-in-viewport" },
        { name: "ember-math-helpers" },
        { name: "ember-power-select" },
      ],
    });
  },
};
