import Service from "@ember/service";
import { A } from "@ember/array";

export default Service.extend({
  init() {
    this._super(...arguments);

    this.set("entries", A());
  },

  pushEntry(id, entry) {
    this.entries.pushObject(Object.assign(entry, { id }));
  },

  replaceEntry(id, newEntry) {
    let entry = this.entries.findBy("id", id);

    this.entries.replace(this.entries.indexOf(entry), 1, [
      Object.assign(newEntry, { id }),
    ]);
  },

  removeEntry(id) {
    let entry = this.entries.findBy("id", id);

    this.entries.removeObject(entry);
  },
});
