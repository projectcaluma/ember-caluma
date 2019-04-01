import Service, { inject as service } from "@ember/service";
import EmberObject from "@ember/object";

/**
 * The options service is there to provide a means to share data
 * between the host application and the addon at runtime.
 *
 * @class OptionsService
 * @extends Ember.Service
 */
export default Service.extend({
  intl: service(),

  init() {
    this._super(...arguments);
    this._data = new EmberObject();

    this._data.set("overrides", [
      {
        label: this.intl.t(
          "caluma.form-builder.question.widgetOverrides.powerselect"
        ),
        component: "cf-field/input/powerselect",
        types: ["choice", "multiplechoice"]
      }
    ]);
  },

  /**
   * Reads a value from the store and
   * provide an optional fallback value.
   *
   * @method get
   * @param {String} path The object path to return.
   * @param {Any} fallback The fallback if the value at path is undefined.
   * @return {Any} The value stored at path, undefined or the fallback.
   */
  get(path, fallback) {
    return this._data.getWithDefault(path, fallback);
  },

  /**
   * Writes a value to the store.
   *
   * @method set
   * @param {String} path The object path to write to.
   * @param {Any} value The value to store at path.
   * @return {Void}
   */
  set(path, value) {
    this._data.set(path, value);
  }
});
