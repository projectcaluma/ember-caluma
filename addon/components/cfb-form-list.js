import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { queryManager } from "ember-apollo-client";
import formListQuery from "ember-caluma/gql/queries/form-list";
import { restartableTask } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";

export default class ComponentsCfbFormListComponent extends Component {
  layout = layout;

  @tracked showArchived = false;

  @queryManager apollo;

  didReceiveAttrs() {
    this.forms.perform();
  }

  @restartableTask
  *forms() {
    return yield this.apollo.watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network",
        variables: { isArchived: false },
      },
      "allForms.edges"
    );
  }

  @restartableTask
  *formsArchived() {
    return yield this.apollo.watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network",
        variables: { isArchived: true },
      },
      "allForms.edges"
    );
  }

  @action
  toggleArchived() {
    this.showArchived = !this.showArchived;

    if (this.showArchived) {
      this.formsArchived.perform();
    }
  }
}
