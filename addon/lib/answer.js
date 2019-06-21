import Base from "ember-caluma/lib/base";
import { computed } from "@ember/object";
import { camelize } from "@ember/string";
import { next } from "@ember/runloop";
import { assert } from "@ember/debug";

/**
 * Object which represents an answer in context of a field
 *
 * @class Answer
 */
export default Base.extend({
  init() {
    this._super(...arguments);

    assert("A graphql answer `raw` must be passed", this.raw);

    this.setProperties(this.raw);
  },

  /**
   * The name of the property in which the value is stored. This depends on the
   * type of the answer.
   *
   *
   * @property {String} _valueKey
   * @accessor
   * @private
   */
  _valueKey: computed("__typename", function() {
    return (
      this.__typename &&
      `${camelize(this.__typename.replace(/Answer$/, ""))}Value`
    );
  }).readOnly(),

  /**
   * The value of the answer, the type of this value depends on the type of the
   * answer.
   *
   * @property {String|Number|String[]} value
   * @computed
   */
  value: computed(
    "_valueKey",
    "stringValue",
    "integerValue",
    "floatValue",
    "listValue",
    "fileValue",
    "dateValue",
    "tableValue",
    {
      get() {
        const value = this.get(this._valueKey);

        if (this.__typename === "TableAnswer") {
          return null;
          // TODO: create document
        }

        return value;
      },
      set(_, value) {
        if (this.__typename === "TableAnswer") {
          value = value.map(doc => doc.id);
        }

        if (this._valueKey) {
          this.set(this._valueKey, value);
        }

        next(this, () => this.field.trigger("valueChanged", value));

        return value;
      }
    }
  )
});
