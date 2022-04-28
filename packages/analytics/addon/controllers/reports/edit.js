import Controller from "@ember/controller";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { useTask } from "ember-resources";
import { task } from "ember-concurrency";
import { inject as service } from "@ember/service";

import getAnalyticsTable from "@projectcaluma/ember-analytics/tasks/get-analytics-table";

export default class ReportsEditController extends Controller {
  @service intl;
  @service notification;
  @queryManager apollo;

  @task getTable = getAnalyticsTable;
  @tracked data = useTask(this, this.getTable, () => [this.model]);
}
