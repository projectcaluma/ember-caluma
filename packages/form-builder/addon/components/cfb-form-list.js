import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { timeout } from "ember-concurrency";
import { restartableTask } from "ember-concurrency-decorators";

import calumaQuery from "@projectcaluma/ember-core/caluma-query";
import { allForms } from "@projectcaluma/ember-core/caluma-query/queries";

export default class ComponentsCfbFormListComponent extends Component {
  @queryManager apollo;

  @calumaQuery({ query: allForms, options: { pageSize: 20 } }) formsQuery;

  @tracked category = "active";
  @tracked search = "";

  get filter() {
    const isArchived =
      this.category === "active"
        ? { isArchived: false }
        : this.category === "archived"
        ? { isArchived: true }
        : null;

    const search = this.search ? { search: this.search } : null;

    return [isArchived, search].filter(Boolean) || null;
  }

  @action
  setFilter(name, eventOrValue) {
    this[name] =
      eventOrValue instanceof Event ? eventOrValue.target.value : eventOrValue;

    this.fetchForms.perform();
  }

  @action
  submit(event) {
    event.preventDefault();
  }

  @action
  loadMoreForms() {
    this.formsQuery.fetchMore();
  }

  @restartableTask
  *fetchForms() {
    yield timeout(500);

    yield this.formsQuery.fetch({
      filter: this.filter,
      order: [{ attribute: "NAME", direction: "ASC" }],
    });
  }
}
