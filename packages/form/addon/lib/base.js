import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";
import EmberObject from "@ember/object";
import { inject as service } from "@ember/service";

export default EmberObject.extend({
  calumaStore: service(),

  init(...args) {
    this._super(...args);

    assert("Owner must be injected", getOwner(this));

    // answers don't need a pk if they are new
    if (!/Answer$/.test(this.get("raw.__typename"))) {
      assert("A primary key `pk` must be passed", this.pk);
      assert(
        "The primary key `pk` must be readonly",
        !Object.getOwnPropertyDescriptor(this, "pk").writable
      );
    }

    if (this.pk) {
      this.calumaStore.push(this);
    }
  },

  willDestroy(...args) {
    this._super(...args);

    if (this.pk) {
      this.calumaStore.delete(this.pk);
    }
  },
});
