import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { useCalumaQuery } from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";

export default class DemoQueriesController extends Controller {
  queryParams = ["status", "pageSize"];

  workItemQuery = useCalumaQuery(this, allWorkItems, () => ({
    options: { pageSize: this.pageSize },
    ...(this.status ? { filter: [{ status: this.status }] } : {}),
  }));

  @tracked status = null;
  @tracked pageSize = 5;

  get possibleStatus() {
    return ["READY", "CANCELED", "COMPLETED", "SKIPPED", "SUSPENDED"];
  }

  get possiblePageSizes() {
    return [1, 5, 10, 20];
  }

  @action
  updateStatus(event) {
    this.status = event.target.value;
  }

  @action
  loadMore() {
    this.workItemQuery.fetchMore();
  }
}
