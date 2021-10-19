import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | options", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  test("it exists", function (assert) {
    const service = this.owner.lookup("service:calumaOptions");
    assert.ok(service);
  });

  test("it returns whatever value was stored", function (assert) {
    const service = this.owner.lookup("service:calumaOptions");
    const value = "bar";

    service.set("foo", value);

    assert.strictEqual(service.get("foo"), value);
  });

  test("it allows for (un)registering of custom components", function (assert) {
    const service = this.owner.lookup("service:calumaOptions");

    const dummy = {
      label: "Dummy One",
      component: "dummy-one",
      types: ["TextQuestion"],
    };

    const initial = service._overrides;

    service.registerComponentOverride(dummy);
    service.unregisterComponentOverride(dummy);

    service.registerComponentOverride(dummy);
    service.unregisterComponentOverride(dummy.component);

    assert.deepEqual(service._overrides, initial);
  });
});
