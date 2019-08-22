import Service from "@ember/service";
import { task } from "ember-concurrency";
import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators";
import { assert } from "@ember/debug";
import { queryManager } from "ember-apollo-client";

export default Service.extend({
  apollo: queryManager(),

  /**
   * Tests a value against one or multiple regular expressions.
   *
   * ```js
   * await this.validator.validate("foo@example.com", ["email", "lowercase"]);
   * ```
   *
   * @param {String} value The value to be tested.
   * @param {String[]} slugs A list of tests (via slug) to run.
   * @return {RSVP.Promise}
   */
  async validate(value, slugs) {
    const validators =
      this.get("validators.lastSuccessful.value") ||
      (await this.validators.perform());

    return slugs.map(slug => {
      const validator = validators.find(validator => validator.slug === slug);

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

  validators: task(function*() {
    const raw = yield this.apollo.query(
      { query: allFormatValidatorsQuery },
      "allFormatValidators.edges"
    );

    return raw.map(rawValidator => {
      return {
        slug: rawValidator.node.slug,
        regex: new RegExp(rawValidator.node.regex),
        errorMsg: rawValidator.node.errorMsg
      };
    });
  })
});
