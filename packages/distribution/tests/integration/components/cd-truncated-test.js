import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-truncated", function (hooks) {
  setupRenderingTest(hooks);

  test("it truncates text", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{5}} />`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("12... more");
  });

  test("it doesn't truncate text that is not longer than the given length", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{10}} />`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("123456789");
  });

  test("it can toggle the truncated text", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{5}} />`, {
      owner: this.engine,
    });

    assert.dom(this.element).hasText("12... more");

    await click("a");

    assert.dom(this.element).hasText("123456789 less");
  });
});
