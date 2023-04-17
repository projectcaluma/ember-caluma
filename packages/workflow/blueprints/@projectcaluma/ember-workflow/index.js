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
        { name: "ember-composable-helpers" },
        { name: "ember-concurrency" },
        { name: "ember-truth-helpers" },
      ],
    });
  },
};
