import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";

import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";
import slugify from "@projectcaluma/ember-core/utils/slugify";

export default class ReportsEditController extends Controller {
  @queryManager apollo;
  @service notification;
  @service router;
  @service intl;

  get availableStartingObjects() {
    // TODO: Replace with dynamic list
    // return this.args.startingObjects;
    return [{ label: "Cases", value: "CASES" }];
  }

  @action
  async createTable(title, startingObject) {
    if (title && startingObject) {
      const slug = slugify(title);
      await this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input: {
              name: title,
              slug,
              startingObject,
            },
          },
        },
        "saveAnalyticsTable.analyticsTable"
      );
      this.router.transitionTo("reports.edit", slug);
    }
  }
}
