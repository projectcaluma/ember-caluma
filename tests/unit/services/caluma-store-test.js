import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | caluma-store", function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:caluma-store");
    assert.ok(service);
  });
});
