import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";

import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;
  @service router;

  get startingObjects() {
    // TODO: Replace with dynamic list
    // return this.args.startingObjects;
    return [{ label: "Cases", value: "CASES" }];
  }

  @dropTask
  *createTable() {
    try {
      this.args.analyticsTable.execute();
      const data = this.args.analyticsTable.data;
      const input = {
        slug: data.slug,
        name: data.name,
        startingObject: data.startingObject,
      };
      yield this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input,
          },
        },
        "saveAnalyticsTable.analyticsTable"
      );
      yield this.args.onAdd?.(
        this.args.analyticsTable.slug,
        this.args.analyticsTable.startingObject
      );
      this.router.transitionTo("reports.edit", data.slug);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.create-error`)
      );
    }
  }
}
