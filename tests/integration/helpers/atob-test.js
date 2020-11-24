import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | atob", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set(
      "inputValue",
      "Q2FzZTo5ZGYzYzYwNy0yZjU0LTQ4YTgtODYzNi1hNDQzNWYyZmI2NTM"
    );

    await render(hbs`{{atob inputValue}}`);

    assert.dom(this.element).hasText("9df3c607-2f54-48a8-8636-a4435f2fb653");
  });
});
