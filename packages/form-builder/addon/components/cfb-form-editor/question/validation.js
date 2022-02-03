import { action } from "@ember/object";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";
import { useTask } from "ember-resources";

import allFormatValidatorsQuery from "@projectcaluma/ember-form-builder/gql/queries/all-format-validators.graphql";

export default class CfbFormEditorQuestionValidation extends Component {
  @queryManager apollo;

  get validators() {
    return this._validators.value?.map((edge) => edge.node) ?? [];
  }

  get selected() {
    return this.validators.filter((validator) =>
      (this.args.value?.edges.map((edge) => edge.node.slug) || []).includes(
        validator.slug
      )
    );
  }

  _validators = useTask(this, this.fetchFormatValidators, () => []);

  @dropTask
  *fetchFormatValidators() {
    return yield this.apollo.watchQuery(
      { query: allFormatValidatorsQuery, fetchPolicy: "cache-and-network" },
      "allFormatValidators.edges"
    );
  }

  @action
  updateValidators(value) {
    this.args.update({ edges: value.map(({ slug }) => ({ node: { slug } })) });
    this.args.setDirty();
  }
}
