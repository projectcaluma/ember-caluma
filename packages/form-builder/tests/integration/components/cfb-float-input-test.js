import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-float-input", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(3);

    await render(
      hbs`<CfbFloatInput @name="test" @update={{fn (mut this.value)}} />`
    );

    assert.dom("input[name=test]").exists();
    assert.dom("input[name=test]").hasAttribute("type", "number");
    assert.dom("input[name=test]").hasAttribute("step", "any");
  });

  test("it triggers updates on change", async function (assert) {
    assert.expect(5);

    this.set("value", 3.1);

    this.set("update", (value) => {
      assert.step("update");

      this.set("value", value);
    });

    this.set("dirty", () => {
      assert.step("dirty");
    });

    await render(
      hbs`<CfbFloatInput @name="test" @value={{this.value}} @update={{this.update}} @setDirty={{this.dirty}} />`
    );

    assert.dom("input[name=test]").hasValue("3.1");

    await fillIn("input", 4.2);

    assert.dom("input[name=test]").hasValue("4.2");

    assert.verifySteps(["update", "dirty"]);
  });
});
