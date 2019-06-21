import EmberObject from "@ember/object";
import { getOwner } from "@ember/application";
import { assert } from "@ember/debug";

export default EmberObject.extend({
  init() {
    this._super(...arguments);

    assert("Owner must be injected", getOwner(this));
  }
});
