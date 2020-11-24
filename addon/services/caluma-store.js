import { assert, debug } from "@ember/debug";
import { set } from "@ember/object";
import Service from "@ember/service";

export default Service.extend({
  init() {
    this._super();

    this.set("_store", []);
  },

  push(obj) {
    assert(
      `Object must have an \`pk\` in order to be pushed into the store`,
      obj.pk
    );

    const existing = this._store.find((i) => i.pk === obj.pk);

    if (existing) {
      debug(
        `Object with the pk \`${obj.pk}\` already exists in the store. It will be updated.`
      );

      set(existing, "raw", obj.raw);

      return existing;
    }

    this.set("_store", [...this._store.filter((i) => i.pk !== obj.pk), obj]);

    return obj;
  },

  find(pk) {
    return this._store.find((i) => i.pk === pk) || null;
  },

  delete(pk) {
    this.set(
      "_store",
      this._store.filter((i) => i.pk !== pk)
    );
  },

  clear() {
    this._store.forEach((obj) => obj.destroy());

    this.set("_store", []);
  },
});
