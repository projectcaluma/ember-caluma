import EmberObject, { computed } from "@ember/object";
import { camelize } from "@ember/string";
import { next } from "@ember/runloop";
import { inject as service } from "@ember/service";

/**
 * Object which represents an answer in context of a field
 *
 * @class Answer
 */
export default EmberObject.extend({
  documentStore: service(),

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
    "dateValue",
    "tableValue",
    {
      get() {
        const value = this.get(this._valueKey);

        if (this.__typename === "TableAnswer") {
          return (
            value &&
            value.map(raw =>
              this.documentStore.find(raw, { parentDocument: this.document })
            )
          );
        }

        return value;
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
