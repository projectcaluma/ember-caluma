import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-jexl-boolean-toggle-switch", function(
  hooks
) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(2);

    this.set("value", "false");

    await render(hbs`
      {{cfb-jexl-boolean-toggle-switch
        name='test'
        value=value
        update=(action (mut value))
      }}
    `);

    assert.dom("input[name=test]").isNotChecked();

    this.set("value", "true");

    await settled();

    assert.dom("input[name=test]").isChecked();
  });

  test("it can toggle", async function(assert) {
    assert.expect(4);

    this.set("value", "false");

    this.set("update", value => {
      assert.step("update");

      this.set("value", value);
    });

    await render(hbs`
      {{cfb-jexl-boolean-toggle-switch
        name='test'
        value=value
        update=(action update)
      }}
    `);

    assert.dom("input[name=test]").isNotChecked();

    await click(".x-toggle");

    assert.dom("input[name=test]").isChecked();

    assert.verifySteps(["update"]);
  });
});
