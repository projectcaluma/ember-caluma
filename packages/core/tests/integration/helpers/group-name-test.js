import { later } from "@ember/runloop";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | group-name", function (hooks) {
  setupRenderingTest(hooks);

  test("it computes the group name with a synchronous resolver", async function (assert) {
    assert.expect(4);

    await render(hbs`{{group-name 1}} - {{group-name 2}}`);

    assert.dom(this.element).hasText("1 - 2");

    this.owner.lookup("service:caluma-options").resolveGroups = function (
      identifiers
    ) {
      assert.step("resolver");
      return identifiers.map((identifier) => ({
        id: identifier,
        name: `Group ${identifier}`,
      }));
    };

    await render(hbs`{{group-name 1}} - {{group-name 2}}`);

    assert.dom(this.element).hasText("Group 1 - Group 2");
    assert.verifySteps(["resolver"]);
  });

  test("it computes the group name with an asynchronous resolver", async function (assert) {
    assert.expect(3);

    this.owner.lookup("service:caluma-options").resolveGroups = function (ids) {
      assert.step("resolver");
      return new Promise((resolve) =>
        later(() => resolve(ids.map((id) => ({ id, name: `Group ${id}` }))), 10)
      );
    };

    await render(hbs`{{group-name 1}} - {{group-name 2}}`);

    assert.dom(this.element).hasText("Group 1 - Group 2");
    assert.verifySteps(["resolver"]);
  });
});
