import { assert, debug } from "@ember/debug";
import { set } from "@ember/object";
import Service from "@ember/service";

export default class CalumaStoreService extends Service {
  constructor(...args) {
    super(...args);

    this._store = new Map();
  }

  push(obj) {
    assert(
      `Object must have an \`pk\` in order to be pushed into the store`,
      obj.pk
    );

    const existing = this._store.get(obj.pk);

    if (existing) {
      debug(
        `Object with the pk \`${obj.pk}\` already exists in the store. It will be updated.`
      );

      set(existing, "raw", obj.raw);

      return existing;
    }

    this._store.set(obj.pk, obj);

    return obj;
  }

  find(pk) {
    return this._store.get(pk) || null;
  }

  delete(pk) {
    this._store.delete(pk);
  }

  clear() {
    this._store.forEach((obj) => obj.destroy());

    this._store.clear();
  }
}
