import { render, typeIn, fillIn, settled, blur } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { timeout } from "ember-concurrency";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-code-editor", function (hooks) {
  setupRenderingTest(hooks);

  test("it updates value", async function (assert) {
    await render(
      hbs`<CfbCodeEditor
  @name="editor"
  @value={{this.value}}
  @language="jexl"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`,
      { owner: this.engine },
    );

    // use `typeIn` because codejar listens to keydown event
    await typeIn("[name=editor]", "1 + 1");
    await blur("[name=editor]");
    await timeout(500);

    // syntax highlighting creates child <span>s
    assert.dom("[name=editor] span.hljs-number").exists({ count: 2 });
    assert.dom("[name=editor] span.hljs-operator").exists({ count: 1 });

    assert.dom(this.element).hasText("1 + 1");
    assert.strictEqual(this.value, "1 + 1");
    assert.true(this.dirty);
  });

  test("it updates value on change from outside", async function (assert) {
    this.value = "true";

    await render(
      hbs`<CfbCodeEditor
  @name="editor"
  @value={{this.value}}
  @language="jexl"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`,
      { owner: this.engine },
    );

    assert.dom(this.element).hasText("true");

    this.set("value", "false");
    await settled();

    assert.dom(this.element).hasText("false");
  });

  test("it updates json data", async function (assert) {
    this.value = {};

    await render(
      hbs`<CfbCodeEditor
  @name="editor"
  @value={{this.value}}
  @language="json"
  @update={{fn (mut this.value)}}
  @setDirty={{fn (mut this.dirty) true}}
/>`,
      { owner: this.engine },
    );

    await fillIn("[name=editor]", `{"bar":"baz"}`);
    await typeIn("[name=editor]", " ");
    await blur("[name=editor]");
    await timeout(500);

    assert.deepEqual(this.value, { bar: "baz" });
    assert.true(this.dirty);
  });
});
