import Service from "@ember/service";
import { task } from "ember-concurrency";
import { inject as service } from "@ember/service";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";
import { computed } from "@ember/object";

export default Service.extend({
  apollo: service(),

  init() {
    this._super(...arguments);
    this._fetchValidators.perform();
  },

  /**
   * Tests a value against one or multiple regular expressions.
   *
   * ```js
   * this.validator.validate("foo@example.com", ["email", "lowercase"]);
   * ```
   * @param {String} value The value to be tested.
   * @param {Array<String>} slugs A list of tests (via slug) to run.
   */
  validate(value, slugs) {
    if (!Array.isArray(slugs)) {
      slugs = [slugs];
    }

    return slugs.map(slug => {
      const validator = this.get("_validators")[slug];

      if (validator) {
        return validator.test(value)
          ? true
          : {
              type: "format",
              message: undefined,
              context: { errorMsg: this.getText(slug) },
              value
            };
      } else {
        throw new Error(`No validator found with the slug ${slug}.`);
      }
    });
  },

  getValidators() {
    return this.get("_validators");
  },

  getText(slug) {
    return this.get("_translations")[slug];
  },

  _fetchValidators: task(function*() {
    return yield this.get("apollo").query(
      { query: allFormatValidatorsQuery },
      "allFormatValidators.edges"
    );
  }),

  _validators: computed("_fetchValidators.lastSuccessful.value", function() {
    const validators = {};
    this.getWithDefault("_fetchValidators.lastSuccessful.value", []).forEach(
      edge => {
        validators[edge.node.slug] = new RegExp(edge.node.regex);
      }
    );
    return validators;
  }),

  _translations: computed("_fetchValidators.lastSuccessful.value", function() {
    const translations = {};
    this.getWithDefault("_fetchValidators.lastSuccessful.value", []).forEach(
      edge => {
        translations[edge.node.slug] = edge.node.errorMsg;
      }
    );
    return translations;
  })
});
