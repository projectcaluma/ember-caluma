import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { queryManager } from "ember-apollo-client";
import formListQuery from "ember-caluma/gql/queries/form-list";
import { restartableTask } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";

export default class ComponentsCfbFormListComponent extends Component {
  layout = layout;

  @queryManager apollo;

  @tracked _filter = "active";

  get filter() {
    return this._filter;
  }
  set filter(value) {
    this._filter = value;
    this.forms.perform();
  }

  didReceiveAttrs() {
    this.forms.perform();
  }

  @restartableTask
  *forms() {
    let filter = [];

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
