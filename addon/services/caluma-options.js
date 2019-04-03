import Service from "@ember/service";
import slugify from "ember-caluma/utils/slugify";

/**
 * The options service is there to provide a means to share data
 * between the host application and the addon at runtime.
 *
 * @class CalumaOptionsService
 * @extends Ember.Service
 */
export default Service.extend({
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
  }
});
