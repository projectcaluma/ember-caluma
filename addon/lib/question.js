import Base from "ember-caluma/lib/base";
import { defineProperty } from "@ember/object";
import { assert } from "@ember/debug";
import { expression } from "ember-caluma/utils/jexl";

/**
 * Object which represents a question in context of a field
 *
 * @class Question
 */
export default class Question extends Base {
  init() {
    assert(
      "A graphql question `raw` must be passed",
      this.raw && /Question$/.test(this.raw.__typename)
    );

    defineProperty(this, "pk", {
      writable: false,
      value: `Question:${this.raw.slug}`
    });

    super.init(...arguments);

    this.setProperties(this.raw);
  }

  @expression("isHidden") hiddenExpression
  @expression("isRequired") requiredExpression
}
