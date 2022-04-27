import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cd-truncated", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it truncates text", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{5}} />`);

    assert.dom(this.element).hasText("12... t:caluma.distribution.more:()");
  });

  test("it doesn't truncate text that is not longer than the given length", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{10}} />`);

    assert.dom(this.element).hasText("123456789");
  });

  test("it can toggle the truncated text", async function (assert) {
    await render(hbs`<CdTruncated @text="123456789" @length={{5}} />`);

    assert.dom(this.element).hasText("12... t:caluma.distribution.more:()");

    await click("a");

    assert.dom(this.element).hasText("123456789 t:caluma.distribution.less:()");
  });
});
