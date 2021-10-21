import { later } from "@ember/runloop";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | user-name", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.uuid1 = "152fd818-8229-4a48-b2b0-8f511c59937a";
    this.uuid2 = "b55dd49e-ab21-48ae-8ecf-c9f82ee710c5";
  });

  test("it computes the users fullName with a synchronous resolver", async function (assert) {
    assert.expect(4);

    await render(hbs`{{user-name this.uuid1}} - {{user-name this.uuid2}}`);

    assert.dom(this.element).hasText(`${this.uuid1} - ${this.uuid2}`);

    this.owner.lookup("service:caluma-options").resolveUsers = function (
      identifiers
    ) {
      assert.step("resolver");
      return identifiers.map((identifier) => ({
        username: identifier,
        fullName: `Hans Muster (${identifier})`,
      }));
    };

    await render(hbs`{{user-name this.uuid1}} - {{user-name this.uuid2}}`);

    assert
      .dom(this.element)
      .hasText(`Hans Muster (${this.uuid1}) - Hans Muster (${this.uuid2})`);
    assert.verifySteps(["resolver"]);
  });

  test("it computes the users fullName with an asynchronous resolver", async function (assert) {
    assert.expect(3);

    this.owner.lookup("service:caluma-options").resolveUsers = function (ids) {
      assert.step("resolver");
      return new Promise((resolve) =>
        later(
          () =>
            resolve(
              ids.map((id) => ({
                username: id,
                fullName: `Hans Muster (${id})`,
              }))
            ),
          10
        )
      );
    };

    await render(hbs`{{user-name this.uuid1}} - {{user-name this.uuid2}}`);

    assert
      .dom(this.element)
      .hasText(`Hans Muster (${this.uuid1}) - Hans Muster (${this.uuid2})`);
    assert.verifySteps(["resolver"]);
  });
});
