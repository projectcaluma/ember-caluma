import Service from "@ember/service";
import slugify from "ember-caluma/utils/slugify";
import EmberObject from "@ember/object";
import { inject as service } from "@ember/service";

/**
 * The options service is there to provide a means to share data
 * between the host application and the addon at runtime.
 *
 * @class CalumaOptionsService
 * @extends Ember.Service
 */
export default Service.extend({
  intl: service(),

  init() {
    this._super(...arguments);
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
   * The property where the namespace is stored.
   * @property _namespace
   */
  _namespace: null,

  /**
   * Sets the namespace.
   *
   * @method setNamespace
   * @param {String} value The new namespace to set.
   * @return {Void}
   */
  setNamespace(value) {
    this._namespace = value ? slugify(String(value)) : null;
  },

  /**
   * Writes a value to the store.
   *
   * @method getNamespace
   * @return {String} The current namespace.
   */
  getNamespace() {
    return this._namespace;
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
