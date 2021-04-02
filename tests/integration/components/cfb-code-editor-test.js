import { render, typeIn, focus } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-code-editor", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set("update", () => assert.step("update"));

    await render(
      hbs`<CfbCodeEditor @name="editor" @language="jexl" @update={{this.update}} />`
    );
    await focus("[name=editor]");
    // use `typeIn` because codejar listens to keydown event
    await typeIn("[name=editor]", "1 + 1");

    // syntax highlighting creates child <span>s
    assert.dom("[name=editor] span").exists({ count: 2 });

    assert.equal(this.element.textContent.trim(), "1 + 1");
    assert.verifySteps(Array.from(Array(5)).map(() => "update"));
  });
});
