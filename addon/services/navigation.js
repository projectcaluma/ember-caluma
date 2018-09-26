import Service from "@ember/service";
import { A } from "@ember/array";

export default Service.extend({
  init() {
    this._super(...arguments);

    this.set("entries", A());
  },

  pushEntry(id, entry) {
    this.get("entries").pushObject(Object.assign(entry, { id }));
  },

  replaceEntry(id, newEntry) {
    let entry = this.get("entries").findBy("id", id);

    this.get("entries").replace(this.get("entries").indexOf(entry), 1, [
      Object.assign(newEntry, { id })
    ]);
  },

  removeEntry(id) {
    let entry = this.get("entries").findBy("id", id);

    this.get("entries").removeObject(entry);
  }
});
