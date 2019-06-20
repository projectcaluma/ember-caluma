import Component from "@ember/component";
import layout from "../../../templates/components/cfb-form-editor/question/validation";
import { task } from "ember-concurrency";
import { inject as service } from "@ember/service";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";
import { computed } from "@ember/object";

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

  actions: {
    updateValidators(value) {
      this.update(value);
      this.setDirty();
    }
  }
});
