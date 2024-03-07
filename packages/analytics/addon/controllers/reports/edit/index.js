import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import getAnalyticsTable from "@projectcaluma/ember-analytics/tasks/get-analytics-table";

export default class ReportsEditIndexController extends Controller {
  @service intl;
  @service notification;
  @queryManager apollo;

  @task getTable = getAnalyticsTable;
  @tracked data = trackedTask(this, this.getTable, () => [this.model]);
}
