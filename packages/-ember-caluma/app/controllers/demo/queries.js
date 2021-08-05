import Controller from "@ember/controller";
import { action } from "@ember/object";

import calumaQuery from "@projectcaluma/ember-core/caluma-query";
import { allWorkItems } from "@projectcaluma/ember-core/caluma-query/queries";

export default class DemoQueriesController extends Controller {
  @calumaQuery({ query: allWorkItems, options: { pageSize: 1 } }) workItemQuery;

  @action
  load() {
    this.workItemQuery.fetch();
  }

  @action
  loadMore() {
    this.workItemQuery.fetchMore();
  }
}
