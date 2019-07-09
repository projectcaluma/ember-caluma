import Service from "@ember/service";
import { task } from "ember-concurrency";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";
import { computed } from "@ember/object";
import { assert } from "@ember/debug";
import { ObjectQueryManager } from "ember-apollo-client";
import { next } from "@ember/runloop";

export default Service.extend(ObjectQueryManager, {
  init() {
    this._super(...arguments);

    next(this._fetchValidators, "perform");
  },

  /**
   * Tests a value against one or multiple regular expressions.
   *
   * ```js
   * this.validator.validate("foo@example.com", ["email", "lowercase"]);
   * ```
   * @param {String} value The value to be tested.
   * @param {String[]} slugs A list of tests (via slug) to run.
   */
  validate(value, slugs) {
    return slugs.map(slug => {
      const validator = this.validators.find(
        validator => validator.slug === slug
      );

      assert(`No validator found with the slug "${slug}".`, validator);

      return (
        validator.regex.test(value) || {
          type: "format",
          message: undefined,
          context: { errorMsg: validator.errorMsg },
          value
        }
      );
    });
  },

  _fetchValidators: task(function*() {
    return yield this.apollo.query(
      { query: allFormatValidatorsQuery },
      "allFormatValidators.edges"
    );
  }),

  validators: computed("_fetchValidators.lastSuccessful.value.[]", function() {
    const rawValidators = this.getWithDefault(
      "_fetchValidators.lastSuccessful.value",
      []
    );

    return rawValidators.map(rawValidator => {
      return {
        slug: rawValidator.node.slug,
        regex: new RegExp(rawValidator.node.regex),
        errorMsg: rawValidator.node.errorMsg
      };
    });
  })
});
