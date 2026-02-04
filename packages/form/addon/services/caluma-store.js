import { assert, debug } from "@ember/debug";
import { destroy } from "@ember/destroyable";
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
      obj.storeKey,
    );

    const existing = this._store.get(obj.storeKey);

    if (existing) {
      debug(
        `Object with the storeKey \`${obj.storeKey}\` already exists in the store. It will be updated.`,
      );

      set(existing, "raw", obj.raw);

      return existing;
    }

    this._store.set(obj.storeKey, obj);

    return obj;
  }

  find(storeKey) {
    return this._store.get(storeKey) || null;
  }

  findByPk(pk) {
    return this._store.values().find((item) => item.pk === pk);
  }

  delete(storeKey) {
    this._store.delete(storeKey);
  }

  clear() {
    this._store.forEach((obj) => destroy(obj));

    // `this._store` is not an ember array but a native map

    this._store.clear();
  }
}
