import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Helper | count-keys", function (hooks) {
  setupRenderingTest(hooks);

  test("it works", async function (assert) {
    this.set("obj", { foo: 1, bar: 2 });

    await render(hbs`{{count-keys this.obj}}`);

    assert.dom(this.element).hasText("2");
  });

  test("it handles invalid arguments", async function (assert) {
    this.set("obj", null);

    await render(hbs`{{count-keys this.obj}}`);

    assert.dom(this.element).hasText("0");
  });
});
