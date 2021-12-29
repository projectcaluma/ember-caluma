import { assert } from "@ember/debug";
import { destroy } from "@ember/destroyable";
import Service from "@ember/service";

export default class CalumaStoreService extends Service {
  _store: Map<string, StoreModel> = new Map();

  /**
   * Push a model into the caluma store
   */
  push(obj: StoreModel): StoreModel {
    assert(
      `Object must have an \`pk\` in order to be pushed into the store`,
      obj.pk
    );

    const existing = this._store.get(obj.pk);

    if (existing) {
      return existing;
    }

    this._store.set(obj.pk, obj);

    return obj;
  }

  /**
   * Find a model in the caluma store
   */
  find(pk: string): StoreModel | null {
    return this._store.get(pk) || null;
  }

  /**
   * Delete a model from the caluma store
   */
  delete(pk: string): void {
    this._store.delete(pk);
  }

  /**
   * Clear the caluma store
   */
  clear(): void {
    this._store.forEach((obj) => destroy(obj));

    this._store.clear();
  }
}
