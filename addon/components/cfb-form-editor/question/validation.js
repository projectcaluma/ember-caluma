import Component from "@ember/component";
import layout from "../../../templates/components/cfb-form-editor/question/validation";
import { task } from "ember-concurrency";
import { inject as service } from "@ember/service";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";

export default Component.extend({
  layout,

  apollo: service(),

  async didReceiveAttrs() {
    this._super(...arguments);

    await this.get("availableFormatValidators").perform();
  },

  availableFormatValidators: task(function*() {
    const formatValidators = yield this.get("apollo").watchQuery(
      { query: allFormatValidatorsQuery, fetchPolicy: "cache-and-network" },
      "allFormatValidators.edges"
    );

    if (!formatValidators.mapBy) {
      return [];
    }
    return formatValidators.map(edge => {
      delete edge.node.__typename;
      return edge.node;
    });
  }).restartable(),

  validators: reads("availableFormatValidators.lastSuccessful.value"),

  selected: computed("value", "validators", function() {
    console.log(this.value);
    return this.validators
      ? this.validators.filter(validator => {
          this.value.includes(validator.slug);
        })
      : [];
  }),

  actions: {
    updateValidators(value) {
      debugger;
      this.update(value.map(validator => validator.slug));
      this.setDirty();
    }
  }
});
