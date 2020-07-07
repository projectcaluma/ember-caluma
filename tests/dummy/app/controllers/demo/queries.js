import Controller from "@ember/controller";
import { action } from "@ember/object";
import calumaQuery from "ember-caluma/caluma-query";
import { allWorkItems } from "ember-caluma/caluma-query/queries";

export default class extends Controller {
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
