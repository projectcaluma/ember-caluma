import Service from "@ember/service";
import EmberObject from "@ember/object";

export default Service.extend({
  init() {
    this._super(...arguments);
    this._data = new EmberObject();
  },

  get(path, fallback) {
    return this._data.getWithDefault(path, fallback);
  },

  set(path, value) {
    this._data.set(path, value);
  }
});
