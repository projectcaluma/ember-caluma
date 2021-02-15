import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { queryManager } from "ember-apollo-client";
import { restartableTask } from "ember-concurrency";

import formListQuery from "ember-caluma/gql/queries/form-list";

export default class ComponentsCfbFormListComponent extends Component {
  @queryManager apollo;

  @tracked _filter = "active";

  get filter() {
    return this._filter;
  }
  set filter(value) {
    this._filter = value;
    this.forms.perform();
  }

  @restartableTask
  *forms() {
    if (this.args.forms) {
      return this.args.forms.perform();
    }

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

    return yield this.apollo.watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network",
        variables: { filter, order: [{ attribute: "NAME", direction: "ASC" }] },
      },
      "allForms.edges"
    );
  }
}
