import { inject as service } from "@ember/service";
import fetch from "fetch";
import { DateTime } from "luxon";

import CalumaOptionsService from "@projectcaluma/ember-core/services/caluma-options";
import DummyOneComponent from "ember-caluma/components/dummy-one";
import DummyTwoComponent from "ember-caluma/components/dummy-two";

export default class CustomCalumaOptionsService extends CalumaOptionsService {
  @service intl;
  @service store;

  namespace = "demo";

  constructor(...args) {
    super(...args);

    this.registerComponentOverride({
      label: "Dummy One",
      component: "dummy-one",
      componentClass: DummyOneComponent,
      types: ["TextQuestion", "TextareaQuestion"],
    });
    this.registerComponentOverride({
      label: "Dummy Two",
      component: "dummy-two",
      componentClass: DummyTwoComponent,
    });

    this.currentGroupId = 1;
  }

  alwaysUseNumberSeparatorWidget = true;

  distribution = {
    inquiry: {
      answer: {
        infoQuestions: ["inquiry-answer-reason", "inquiry-answer-hint"],
      },
    },
    ui: {
      new: {
        showAllServices: false, // if true all the services are shown in one big table
      },
    },
    new: {
      defaultTypes: ["suggestions", "private"],
      types: {
        federal: { label: "dummy.types.federal" },
        private: { label: "dummy.types.private" },
        others: { label: "dummy.types.others" },
      },
    },
  };

  // BEGIN-SNIPPET caluma-options-service-query-if-not-cached.js
  async queryIfNotCached(identifiers, type) {
    const cachedIdentifiers = this.store
      .peekAll(type)
      .map((obj) => String(obj[this[`${type}IdentifierProperty`]]));
    const uncachedIdentifiers = identifiers.filter(
      (identifier) => !cachedIdentifiers.includes(String(identifier)),
    );

    if (uncachedIdentifiers.length) {
      await this.store.query(type, {
        filter: { id: String(uncachedIdentifiers) },
      });
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

  async fetchTypedGroups(types, search) {
    const response = await this.store.query("group", {
      filter: { types: String(types), search },
      include: "type",
    });

    return types.reduce(
      (all, type) => ({
        ...all,
        [type]: response.filter((group) => group.get("type.name") === type),
      }),
      {},
    );
  }

  async sendReminderDistributionInquiry(inquiryId) {
    await fetch(`/${inquiryId}/send-reminder`, {
      method: "POST",
    });
  }

  calculateDistributionDefaultDeadline(defaultLeadTime, selectedGroups) {
    return DateTime.now()
      .plus({
        // Add a day per selected group to the actual deadline. This only serves
        // as demonstration of the possibilities of this function and is not
        // meaningful at all
        days: defaultLeadTime + selectedGroups.length,
      })
      .toISODate();
  }
}
