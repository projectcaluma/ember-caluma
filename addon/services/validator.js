import { assert } from "@ember/debug";
import Service from "@ember/service";
import { isEmpty } from "@ember/utils";
import { queryManager } from "ember-apollo-client";
import { task } from "ember-concurrency";

import allFormatValidatorsQuery from "ember-caluma/gql/queries/all-format-validators.graphql";

export default class ValidatorService extends Service {
  @queryManager() apollo;

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
    if (isEmpty(value)) {
      // empty values should not be validated since they are handled by the
      // requiredness validation
      return slugs.map(() => true);
    }

    const validators =
      this.validators.lastSuccessful?.value ||
      (await this.validators.perform());

    return slugs.map((slug) => {
      const validator = validators.find((validator) => validator.slug === slug);

      assert(`No validator found with the slug "${slug}".`, validator);

      return (
        validator.regex.test(value) || {
          type: "format",
          message: undefined,
          context: { errorMsg: validator.errorMsg },
          value,
        }
      );
    });
  }

  @task
  *validators() {
    const raw = yield this.apollo.query(
      { query: allFormatValidatorsQuery },
      "allFormatValidators.edges"
    );

    return raw.map((rawValidator) => {
      return {
        slug: rawValidator.node.slug,
        regex: new RegExp(rawValidator.node.regex),
        errorMsg: rawValidator.node.errorMsg,
      };
    });
  }
}
