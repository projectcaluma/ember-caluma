"use strict";

module.exports = {
  normalizeEntityName() {},

  afterInstall() {
    return this.addAddonsToProject({
      packages: [
        { name: "ember-apollo-client" },
        { name: "ember-intl" },
        { name: "ember-uikit" },
      ],
    }).then(() => this.addPackagesToProject([{ name: "moment" }]));
  },
};
