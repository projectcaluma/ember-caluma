import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-float-input/input", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(3);

    await render(hbs`{{cfb-float-input/input name="test"}}`);

    assert.dom("input[name=test]").exists();
    assert.dom("input[name=test]").hasAttribute("type", "number");
    assert.dom("input[name=test]").hasAttribute("step", "any");
  });
});
