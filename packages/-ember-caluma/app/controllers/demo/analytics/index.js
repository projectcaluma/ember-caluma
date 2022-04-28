import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";

import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import slugify from "@projectcaluma/ember-core/utils/slugify";

export default class DemoAnalyticsIndexController extends Controller {
  @service router;
  @queryManager apollo;

  @tracked startingObject;
  @tracked tableSlug;

  // TODO: Replace with dynamic list
  get availableStartingObjects() {
    return [{ label: "Cases", value: "CASES" }];
  }

  @action
  setStartingObject(value) {
    this.startingObject = value;
  }

  @action
  setTableSlug(value) {
    this.tableSlug = slugify(value);
  }

  @action
  async newTable() {
    if (this.tableSlug && this.startingObject) {
      await this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input: {
              name: this.tableSlug,
              slug: this.tableSlug,
              startingObject: this.startingObject.value,
            },
          },
        },
        "saveAnalyticsTable.analyticsTable"
      );
      this.router.transitionTo("demo.analytics.builder", this.tableSlug);
    }
  }
}
