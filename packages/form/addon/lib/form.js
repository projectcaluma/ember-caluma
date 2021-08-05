import { assert } from "@ember/debug";
import { defineProperty } from "@ember/object";

import Base from "@projectcaluma/ember-form/lib/base";

/**
 * Object that represents a blueprint form
 *
 * @class Form
 */
export default Base.extend({
  init(...args) {
    assert(
      "A graphql form `raw` must be passed",
      this.raw && this.raw.__typename === "Form"
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Form:${this.raw.slug}`,
    });

    this._super(...args);

    this.setProperties(this.raw);
  },
});
