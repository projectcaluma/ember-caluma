import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | navigation", function(hooks) {
  setupTest(hooks);

  test("it exists", function(assert) {
    assert.expect(1);

    let service = this.owner.lookup("service:navigation");

    assert.deepEqual(service.get("entries"), []);
  });

  test("it can push an entry", function(assert) {
    assert.expect(1);

    let service = this.owner.lookup("service:navigation");

    service.pushEntry("someid", { foo: "bar" });

    assert.deepEqual(service.get("entries"), [{ id: "someid", foo: "bar" }]);
  });

  test("it can remove an entry", function(assert) {
    assert.expect(1);

    let service = this.owner.lookup("service:navigation");

    service.pushEntry("someid", { foo: "bar" });
    service.removeEntry("someid");

    assert.deepEqual(service.get("entries"), []);
  });

  test("it can replace an entry", function(assert) {
    assert.expect(1);

    let service = this.owner.lookup("service:navigation");

    service.pushEntry("someid", { foo: "bar" });
    service.replaceEntry("someid", { foo: "baz" });

    assert.deepEqual(service.get("entries"), [{ id: "someid", foo: "baz" }]);
  });
});
