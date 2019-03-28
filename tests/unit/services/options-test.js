import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | options", function(hooks) {
  setupTest(hooks);

  test("it exists", function(assert) {
    let service = this.owner.lookup("service:options");
    assert.ok(service);
  });

  test("it returns whatever value was stored", function(assert) {
    let service = this.owner.lookup("service:options");
    const value = "bar";

    service.set("foo", value);

    assert.equal(service.get("foo"), value);
  });
});
