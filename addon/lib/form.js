import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";
import { computed } from "@ember/object";

/**
 * Object that represents a blueprint form
 *
 * @class Form
 */
export default Base.extend({
  init() {
    this._super(...arguments);

    assert(
      "A graphql form `raw` must be passed",
      this.raw && this.raw.__typename === "Form"
    );

    this.setProperties(this.raw);
  },

  /**
   * The unique identifier for the form which consists of the form slug
   * prefixed by "Form".
   *
   * E.g: `Form:some-form-slug`
   *
   * @property {String} pk
   * @accessor
   */
  pk: computed("slug", function() {
    return `Form:${this.slug}`;
  })
});
