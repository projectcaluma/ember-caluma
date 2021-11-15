import Controller from "@ember/controller";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import calumaQuery from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";

export default class DemoQueriesController extends Controller {
  queryParams = ["status"];

  @calumaQuery({ query: allWorkItems, options: { pageSize: 5 } }) workItemQuery;

  @tracked status = null;

  get possibleStatus() {
    return ["READY", "CANCELED", "COMPLETED", "SKIPPED", "SUSPENDED"];
  }

  @action
  updateStatus(event) {
    this.status = event.target.value;
  }

  @action
  load() {
    this.workItemQuery.fetch(
      this.status ? { filter: [{ status: this.status }] } : {}
    );
  }

  @action
  loadMore() {
    this.workItemQuery.fetchMore();
  }
}
