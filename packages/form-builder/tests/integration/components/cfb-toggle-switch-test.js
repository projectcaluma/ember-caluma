import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-toggle-switch", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(2);

    this.set("value", false);

    await render(
      hbs`<CfbToggleSwitch
  @name="test"
  @value={{this.value}}
  @update={{fn (mut this.value)}}
/>`,
      { owner: this.engine },
    );

    assert.dom("input[name=test]").isNotChecked();

    this.set("value", true);

    assert.dom("input[name=test]").isChecked();
  });

  test("it can toggle", async function (assert) {
    assert.expect(4);

    this.set("value", false);

    this.set("update", (value) => {
      assert.step("update");

      this.set("value", value);
    });

    await render(
      hbs`<CfbToggleSwitch @name="test" @value={{this.value}} @update={{this.update}} />`,
      { owner: this.engine },
    );

    assert.dom("input[name=test]").isNotChecked();

    await click(".x-toggle");

    assert.dom("input[name=test]").isChecked();

    assert.verifySteps(["update"]);
  });
});
