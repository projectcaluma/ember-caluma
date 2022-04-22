import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import {
  dropTask,
  enqueueTask,
  restartableTask,
  lastValue,
} from "ember-concurrency-decorators";
import { LifecycleResource } from "ember-resources";

import getAnalyticsTableQuery from "@projectcaluma/ember-analytics/gql/queries/get-analytics-table.graphql";
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

export default class FetchAnalyticsTable extends LifecycleResource {
  @queryManager apollo;

  @tracked value = null;
  @tracked isRunning = true;
  @tracked hasError = false;

  update() {
    this.value = null;
    this.isRunning = true;
    this.hasError = false;
    return this.setup();
  }

  async setup() {
    const [slug] = this.args.positional;
    try {
      if (slug) {
        this.value = await this.apollo.watchQuery(
          {
            query: getAnalyticsTableQuery,
            fetchPolicy: "cache-and-network",
            variables: { slug },
          },
          "analyticsTable"
        );
      } else {
        this.value = new Changeset(
          new AnalyticsTable({
            startingObject: "CASES",
          }),
          lookupValidator(AnalyticsTableValidations),
          AnalyticsTableValidations
        );
      }

      this.isRunning = false;
    } catch (error) {
      console.error(error);
      this.hasError = true;
      this.isRunning = false;
      this.value = null;
    }
  }
}
