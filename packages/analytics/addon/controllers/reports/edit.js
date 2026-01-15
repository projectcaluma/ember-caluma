import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import removeAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-table.graphql";
import getAnalyticsTable from "@projectcaluma/ember-analytics/tasks/get-analytics-table";

export default class ReportsEditController extends Controller {
  @service intl;
  @service notification;
  @service router;
  @queryManager apollo;

  getTable = task(async (slug) => getAnalyticsTable(slug));
  data = trackedTask(this, this.getTable, () => [this.model]);

  get currentRoute() {
    return this.router.currentRouteName.split(".").pop();
  }

  deleteTable = task({ drop: true }, async () => {
    try {
      await this.apollo.mutate({
        mutation: removeAnalyticsTableMutation,
        fetchPolicy: "network-only",
        variables: {
          input: {
            slug: this.data.value.slug,
          },
        },
      });
      this.router.transitionTo("reports");
    } catch (error) {
      console.error(error);
      this.notification.danger(
        this.intl.t(`caluma.analytics.notification.delete-error`),
      );
    }
  });
}
