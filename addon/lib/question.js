import Base from "ember-caluma/lib/base";
import { defineProperty } from "@ember/object";
import { assert } from "@ember/debug";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default Base.extend({
  init() {
    assert(
      "A graphql question `raw` must be passed",
      this.raw && /Question$/.test(this.raw.__typename)
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Question:${this.raw.slug}`
    });

    this._super(...arguments);

    this.setProperties(this.raw);
  }
});
