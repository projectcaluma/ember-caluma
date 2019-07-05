import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";
import { defineProperty } from "@ember/object";

/**
 * Object that represents a blueprint form
 *
 * @class Form
 */
export default Base.extend({
  init() {
    assert(
      "A graphql form `raw` must be passed",
      this.raw && this.raw.__typename === "Form"
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Form:${this.raw.slug}`
    });

    this._super(...arguments);

    this.setProperties(this.raw);
  }
});
