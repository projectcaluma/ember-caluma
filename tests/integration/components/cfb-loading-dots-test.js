import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-loading-dots", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    await render(hbs`{{cfb-loading-dots}}`);

    assert.dom("span").hasText("Loading...");

    await render(hbs`{{#cfb-loading-dots}}Test{{/cfb-loading-dots}}`);

    assert.dom("span").hasText("Test...");
  });
});
