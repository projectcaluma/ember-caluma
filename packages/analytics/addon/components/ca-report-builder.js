import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";

import saveAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/save-analytics-table.graphql";

export default class CaReportBuilderComponent extends Component {
  @queryManager apollo;
  @service notification;
  @service intl;
  @service router;

  get startingObjects() {
    // startingObjects defined by schema
    return [
      {
        label: this.intl.t(`caluma.analytics.starting-options.cases`),
        value: "CASES",
      },
      {
        label: this.intl.t(`caluma.analytics.starting-options.work-items`),
        value: "WORK_ITEMS",
      },
      {
        label: this.intl.t(`caluma.analytics.starting-options.documents`),
        value: "DOCUMENTS",
      },
    ];
  }

  createTable = task({ drop: true }, async () => {
    try {
      this.args.analyticsTable.execute();
      const data = this.args.analyticsTable.data;
      const input = {
        slug: data.slug,
        name: data.name,
        startingObject: data.startingObject,
      };
      await this.apollo.mutate(
        {
          mutation: saveAnalyticsTableMutation,
          fetchPolicy: "network-only",
          variables: {
            input,
          },
        },
        "saveAnalyticsTable.analyticsTable",
      );
      await this.args.onAdd?.(
        this.args.analyticsTable.slug,
        this.args.analyticsTable.startingObject,
      );
      this.router.transitionTo("reports.edit", data.slug);
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.create-error`),
      );
    }
  });
}
