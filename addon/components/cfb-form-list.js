import Component from "@ember/component";
import layout from "../templates/components/cfb-form-list";
import { queryManager } from "ember-apollo-client";
import formListQuery from "ember-caluma/gql/queries/form-list";
import { restartableTask } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";

export default class ComponentsCfbFormListComponent extends Component {
  layout = layout;

  @queryManager apollo;

  @tracked _showArchived = false;

  get showArchived() {
    return this._showArchived;
  }
  set showArchived(value) {
    this._showArchived = value;
    this.forms.perform();
  }

  didReceiveAttrs() {
    this.forms.perform();
  }

  @restartableTask
  *forms() {
    return yield this.apollo.watchQuery(
      {
        query: formListQuery,
        fetchPolicy: "cache-and-network",
        variables: { isArchived: this.showArchived },
      },
      "allForms.edges"
    );
  }
}
