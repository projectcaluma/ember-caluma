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
        { name: "@ember/legacy-built-in-components" },
        { name: "@projectcaluma/ember-core" },
        { name: "@projectcaluma/ember-form" },
        { name: "ember-changeset" },
        { name: "ember-composable-helpers" },
        { name: "ember-engines" },
        { name: "ember-flatpickr" },
        { name: "ember-math-helpers" },
        { name: "ember-power-select" },
        { name: "ember-validated-form" },
      ],
    });
  },
};
