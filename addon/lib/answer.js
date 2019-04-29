import EmberObject, { computed } from "@ember/object";
import { camelize } from "@ember/string";
import { next } from "@ember/runloop";

/**
 * Object which represents an answer in context of a field
 *
 * @class Answer
 */
export default EmberObject.extend({
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
   */
  value: computed(
    "_valueKey",
    "stringValue",
    "integerValue",
    "floatValue",
    "listValue",
    "fileValue",
    {
      get() {
        return this.get(this._valueKey);
      },
      set(_, value) {
        if (this._valueKey) {
          this.set(this._valueKey, value);
        }

        next(this, () => this.field.trigger("valueChanged", value));

        return value;
      }
    }
  )
});
