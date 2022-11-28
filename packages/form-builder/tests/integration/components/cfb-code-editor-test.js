import { render, typeIn, fillIn, settled, blur } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-code-editor", function (hooks) {
  setupRenderingTest(hooks);

  test("it updates value", async function (assert) {
    await render(hbs`<CfbCodeEditor
  @name="editor"
  @language="jexl"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`);

    // use `typeIn` because codejar listens to keydown event
    await typeIn("[name=editor]", "1 + 1");
    await blur("[name=editor]");

    // syntax highlighting creates child <span>s
    assert.dom("[name=editor] span").exists({ count: 2 });

    assert.dom(this.element).hasText("1 + 1");
    assert.strictEqual(this.value, "1 + 1");
    assert.true(this.dirty);
  });

  test("it updates value on change from outside", async function (assert) {
    this.value = "true";

    await render(hbs`<CfbCodeEditor
  @name="editor"
  @value={{this.value}}
  @language="jexl"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`);

    assert.dom(this.element).hasText("true");

    this.set("value", "false");
    await settled();

    assert.dom(this.element).hasText("false");
  });

  test("it updates json data", async function (assert) {
    this.value = {};

    await render(hbs`<CfbCodeEditor
  @name="editor"
  @value={{this.value}}
  @language="json"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`);

    await fillIn("[name=editor]", `{"bar":"baz"}`);
    await typeIn("[name=editor]", " ");
    await blur("[name=editor]");

    assert.deepEqual(this.value, { bar: "baz" });
    assert.true(this.dirty);
  });
});
