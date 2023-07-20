import Route from "@ember/routing/route";
import { tracked } from "@glimmer/tracking";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";

import AnalyticsTableValidations from "@projectcaluma/ember-analytics/validations/analytics-table";
import slugify from "@projectcaluma/ember-core/utils/slugify";

class AnalyticsTable {
  constructor({ name, startingObject } = {}) {
    this.name = name;
    this.startingObject = startingObject;
  }

  get slug() {
    return slugify(this.name ?? "");
  }
  @tracked name;
  @tracked startingObject;
}

export default class ReportsNewRoute extends Route {
  model() {
    return new Changeset(
      new AnalyticsTable({
        startingObject: "CASES",
      }),
      lookupValidator(AnalyticsTableValidations),
      AnalyticsTableValidations,
    );
  }
}
