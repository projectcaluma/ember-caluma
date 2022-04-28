import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { useTask } from "ember-resources";
import { task, dropTask } from "ember-concurrency";
import { inject as service } from "@ember/service";

import getAnalyticsTable from "@projectcaluma/ember-analytics/tasks/get-analytics-table";
import removeAnalyticsTableMutation from "@projectcaluma/ember-analytics/gql/mutations/remove-analytics-table.graphql";

export default class ReportsEditIndexController extends Controller {
  @service intl;
  @service notification;
  @queryManager apollo;

  @task getTable = getAnalyticsTable;
  @tracked data = useTask(this, this.getTable, () => [this.model]);

  @dropTask
  *deleteTable() {
    try {
      yield this.apollo.mutate({
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
        this.intl.t(`caluma.analytics.notification.delete_error`)
      );
    }
  }
}
