import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | reports/edit/preview", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:reports/edit/preview");
    assert.ok(route);
  });
});
