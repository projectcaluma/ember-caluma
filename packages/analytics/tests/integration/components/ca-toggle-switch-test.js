import { render, click, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | ca-toggle-switch", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, ["en"]);

  test("it renders", async function (assert) {
    assert.expect(2);

    this.set("value", false);

    await render(hbs`
        <CaToggleSwitch
          @name="test"
          @value={{this.value}}
          @update={{fn (mut this.value)}}
        />
      `);

    assert.dom("input[name=test]").isNotChecked();

    this.set("value", true);
    await settled();

    assert.dom("input[name=test]").isChecked();
  });

  test("it can toggle", async function (assert) {
    assert.expect(4);

    this.set("value", false);

    this.set("update", (value) => {
      assert.step("update");
      this.set("value", value);
    });

    await render(hbs`
        <CaToggleSwitch
          @name="test"
          @value={{this.value}}
          @update={{this.update}}
        />
      `);

    assert.dom("input[name=test]").isNotChecked();

    await click(".x-toggle");

    assert.dom("input[name=test]").isChecked();

    assert.verifySteps(["update"]);
  });
});
