import { action } from "@ember/object";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { dropTask } from "ember-concurrency";

import allFormatValidatorsQuery from "@projectcaluma/ember-form-builder/gql/queries/all-format-validators.graphql";

export default class CfbFormEditorQuestionValidation extends Component {
  @queryManager apollo;

  @dropTask
  *availableFormatValidators() {
    const formatValidators = yield this.apollo.watchQuery(
      { query: allFormatValidatorsQuery, fetchPolicy: "cache-and-network" },
      "allFormatValidators.edges"
    );
    return formatValidators.map((edge) => edge.node);
  }

  get validators() {
    return this.availableFormatValidators?.lastSuccessful?.value || [];
  }

  get selected() {
    return this.validators.filter((validator) =>
      (this.args.value || []).includes(validator.slug)
    );
  }

  @action
  updateValidators(value) {
    this.args.update(value.map((validator) => validator.slug));
    this.args.setDirty();
  }
}
