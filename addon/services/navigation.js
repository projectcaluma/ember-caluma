import { A } from "@ember/array";
import Service from "@ember/service";

export default Service.extend({
  init(...args) {
    this._super(...args);

    this.set("entries", A());
  },

  pushEntry(id, entry) {
    this.entries.pushObject(Object.assign(entry, { id }));
  },

  replaceEntry(id, newEntry) {
    const entry = this.entries.findBy("id", id);

    this.entries.replace(this.entries.indexOf(entry), 1, [
      Object.assign(newEntry, { id }),
    ]);
  },

  removeEntry(id) {
    const entry = this.entries.findBy("id", id);

    this.entries.removeObject(entry);
  },
});
