import { module, test } from "qunit";
import { setupTest } from "ember-qunit";

module("Unit | Service | options", function(hooks) {
  setupTest(hooks);

  test("it exists", function(assert) {
    const service = this.owner.lookup("service:options");
    assert.ok(service);
  });

  test("it returns whatever value was stored", function(assert) {
    const service = this.owner.lookup("service:options");
    const value = "bar";

    service.set("foo", value);

    assert.equal(service.get("foo"), value);
  });

  test("it allows for (un)registering of custom components", function(assert) {
    const service = this.owner.lookup("service:options");

    const dummy = {
      label: "Dummy One",
      component: "dummy-one",
      types: ["TextQuestion"]
    };

    const initial = service._overrides;

    service.registerComponentOverride(dummy);
    service.unregisterComponentOverride(dummy);

    service.registerComponentOverride(dummy);
    service.unregisterComponentOverride(dummy.component);

    assert.equal(service._overrides, initial);
  });
});
