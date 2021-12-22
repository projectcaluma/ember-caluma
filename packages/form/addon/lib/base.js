import { setOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";

export default class Base {
  @service calumaStore;

  constructor({ raw, owner }) {
    assert("`owner` must be passed as an argument", owner);

    assert("A primary key `pk` must be defined on the object", "pk" in this);

    setOwner(this, owner);

    if (raw) {
      this.raw = raw;
    }

    registerDestructor(this, () => {
      if (this.pk) {
        this.calumaStore.delete(this.pk);
      }
    });
  }

  /**
   * The raw data of the object
   *
   * @property {Object} raw
   */
  raw = {};

  /**
   * Push the object into the caluma store
   *
   * @method pushIntoStore
   */
  pushIntoStore() {
    if (this.pk) {
      this.calumaStore.push(this);
    }
  }
}
