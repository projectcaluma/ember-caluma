import { action } from "@ember/object";
import { underscore } from "@ember/string";
import Component from "@glimmer/component";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";
import { trackedTask } from "reactiveweb/ember-concurrency";

import allFormatValidatorsQuery from "@projectcaluma/ember-form-builder/gql/queries/all-format-validators.graphql";

export default class CfbFormEditorQuestionValidation extends Component {
  @queryManager apollo;

  get simpleQuestionType() {
    return underscore(this.args.questionType.replace(/Question$/, ""));
  }

  get validators() {
    return (
      this._validators.value
        ?.map((edge) => edge.node)
        .filter((node) => {
          const allowed = node.allowedQuestionTypes;

          return (
            allowed.length === 0 || allowed.includes(this.simpleQuestionType)
          );
        }) ?? []
    );
  }

  get selected() {
    return this.validators.filter((validator) =>
      (this.args.value?.edges.map((edge) => edge.node.slug) || []).includes(
        validator.slug,
      ),
    );
  }

  fetchFormatValidators = task({ drop: true }, async () => {
    return await this.apollo.watchQuery(
      { query: allFormatValidatorsQuery, fetchPolicy: "cache-and-network" },
      "allFormatValidators.edges",
    );
  });

  _validators = trackedTask(this, this.fetchFormatValidators, () => []);

  @action
  updateValidators(value) {
    this.args.update({ edges: value.map(({ slug }) => ({ node: { slug } })) });
    this.args.setDirty();
  }
}
