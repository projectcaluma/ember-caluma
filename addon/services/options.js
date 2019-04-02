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
    this._overrides = new EmberObject();

    this.registerComponentOverride({
      label: this.intl.t(
        "caluma.form-builder.question.widgetOverrides.powerselect"
      ),
      component: "cf-field/input/powerselect",
      types: ["ChoiceQuestion", "MultipleChoiceQuestion"]
    });
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
  },

  /**
   * Registers a new component override.
   *
   * @param {Object} override The additional override.
   * @param {String} override.label The text displayed in the form-builder dropdown.
   * @param {String} override.component The path/name of the overriding component.
   * @param {Array} [override.types] An optional question type restriction.
   * @return {Void}
   */
  registerComponentOverride(override) {
    this._overrides[override.component] = override;
  },

  /**
   * Unregisters a component override.
   *
   * @param {Object|String} override Either an override object (see register method) or a component path/name.
   * @return {Void}
   */
  unregisterComponentOverride(override) {
    delete this._overrides[override.component ? override.component : override];
  },

  /**
   * Returns the registered overrides as an array.
   *
   * @return {Array} The list of overrides matching the predicate.
   */
  getComponentOverrides() {
    return Object.values(this._overrides);
  }
});
