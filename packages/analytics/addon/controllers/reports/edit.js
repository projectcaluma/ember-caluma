import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { useTask } from "ember-resources";

import getAnalyticsTable from "@projectcaluma/ember-analytics/tasks/get-analytics-table";

export default class ReportsEditController extends Controller {
  @service intl;
  @service notification;
  @service router;
  @queryManager apollo;

  @task getTable = getAnalyticsTable;
  @tracked data = useTask(this, this.getTable, () => [this.model]);

  get currentRoute() {
    return this.router.currentRouteName.split(".").pop();
  }
}
