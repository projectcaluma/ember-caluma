import { setOwner } from "@ember/application";
import { assert } from "@ember/debug";
import { registerDestructor } from "@ember/destroyable";
import { inject as service } from "@ember/service";
import { cached } from "tracked-toolbox";

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
      if (this.storeKey) {
        this.calumaStore.delete(this.storeKey);
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
   * The primary key of the lib class.
   * Must be overridden in subclasses.
   *
   * @property {String} pk
   */
  @cached
  get pk() {
    throw new Error("pk getter must be implemented in subclass");
  }

  /**
   * The caluma store key of the answer.
   *
   * @property {String} storeKey
   */
  @cached
  get storeKey() {
    return this.pk;
  }

  /**
   * Push the object into the caluma store
   *
   * @method pushIntoStore
   */
  pushIntoStore() {
    if (this.storeKey) {
      this.calumaStore.push(this);
    }
  }
}
