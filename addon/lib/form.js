import Base from "ember-caluma/lib/base";
import { assert } from "@ember/debug";

/**
 * @class Form
 */
export default Base.extend({
  init() {
    this._super(...arguments);

    assert("A graphql form `raw` must be passed", this.raw);

    this.setProperties(this.raw);
  }
});
