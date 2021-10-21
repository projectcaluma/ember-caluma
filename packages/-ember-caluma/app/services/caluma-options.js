import { inject as service } from "@ember/service";

import CalumaOptionsService from "@projectcaluma/ember-core/services/caluma-options";
import ENV from "ember-caluma/config/environment";

export default class CustomCalumaOptionsService extends CalumaOptionsService {
  @service intl;
  @service store;

  constructor(...args) {
    super(...args);

    if (ENV.environment !== "production") {
      this.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-one"
        ),
        component: "dummy-one",
        types: ["TextQuestion", "TextareaQuestion"],
      });

      this.registerComponentOverride({
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.dummy-two"
        ),
        component: "dummy-two",
      });
    }
  }

  // BEGIN-SNIPPET caluma-options-service-query-if-not-cached.js
  async queryIfNotCached(identifiers, type) {
    const cachedIdentifiers = this.store
      .peekAll(type)
      .map((obj) => String(obj[this[`${type}IdentifierProperty`]]));
    const uncachedIdentifiers = identifiers.filter(
      (identifier) => !cachedIdentifiers.includes(String(identifier))
    );

    if (uncachedIdentifiers.length) {
      await this.store.query(type, { id: String(uncachedIdentifiers) });
    }

    return this.store.peekAll(type);
  }
  // END-SNIPPET

  // BEGIN-SNIPPET caluma-options-service-groups.js
  resolveGroups(identifiers) {
    return this.queryIfNotCached(identifiers, "group");
  }
  // END-SNIPPET

  // BEGIN-SNIPPET caluma-options-service-users.js
  userIdentifierProperty = "id";
  resolveUsers(identifiers) {
    return this.queryIfNotCached(identifiers, "user");
  }
  // END-SNIPPET
}
