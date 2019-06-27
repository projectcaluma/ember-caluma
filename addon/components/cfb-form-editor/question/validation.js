import Component from "@ember/component";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import layout from "../../../templates/components/cfb-form-editor/question/validation";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";

export default Component.extend({
  classNames: ["format-validators"],
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
    return formatValidators.map(edge => edge.node);
  }).restartable(),

  validators: computed(
    "availableFormatValidators.lastSuccessful.value",
    function() {
      if (this.availableFormatValidators.lastSuccessful) {
        return this.availableFormatValidators.lastSuccessful.value;
      } else {
        return [];
      }
    }
  ),

  selected: computed("value", "validators", function() {
    return this.getWithDefault("validators", []).filter(validator =>
      this.getWithDefault("value", []).includes(validator.slug)
    );
  }),

  actions: {
    updateValidators(value) {
      this.update(value.map(validator => validator.slug));
      this.setDirty();
    }
  }
});
