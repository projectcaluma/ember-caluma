import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-float-input/input", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(3);

    await render(hbs`{{cfb-float-input/input name="test"}}`);

    assert.dom("input[name=test]").exists();
    assert.dom("input[name=test]").hasAttribute("type", "number");
    assert.dom("input[name=test]").hasAttribute("step", "any");
  });
});
