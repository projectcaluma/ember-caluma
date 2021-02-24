import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { timeout } from "ember-concurrency";
import { restartableTask } from "ember-concurrency-decorators";

import calumaQuery from "ember-caluma/caluma-query";
import { allForms } from "ember-caluma/caluma-query/queries";

export default class ComponentsCfbFormListComponent extends Component {
  @queryManager apollo;
  @calumaQuery({ query: allForms, options: { pageSize: 20 } }) formsQuery;

  @tracked _filter = "active";
  @tracked search = "";

  get filter() {
    return this._filter;
  }
  set filter(value) {
    this._filter = value;
    this.fetchForms.perform();
  }

  @action
  searchForms(event) {
    this.search = event.target.value;
    this.fetchForms.perform();
  }

  @action
  loadMoreForms() {
    this.formsQuery.fetchMore();
  }

  @restartableTask
  *fetchForms() {
    yield timeout(500);

    const filter = [];

    switch (this.filter) {
      case "all":
        break;
      case "active":
        filter.push({ isArchived: false });
        break;
      case "archived":
        filter.push({ isArchived: true });
        break;
    }

    if (this.search) {
      filter.push({ search: this.search });
    }

    yield this.formsQuery.fetch({
      filter,
      order: [{ attribute: "NAME", direction: "ASC" }],
    });
  }
}
