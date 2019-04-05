import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { fillIn, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-prefixed-input", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    let slug = null;
    this.set("update", value => {
      slug = value;
    });

    const selector = "[data-test-prefixed-input]";
    const value = "test";

    await render(hbs`{{cfb-prefixed-input update=update}}`);
    assert.dom(selector).exists();

    await fillIn(selector, value);
    assert.equal(slug, value);
  });
});
