import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import { setupIntl } from "ember-intl/test-support";

module("Integration | Component | cfb-label", function(hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function(assert) {
    assert.expect(3);

    this.set("required", true);

    await render(hbs`{{cfb-label label='Test' required=required}}`);

    assert.dom("label").hasText("Test");

    this.set("required", false);

    assert
      .dom("label")
      .hasText("Test (t:caluma.form-builder.global.optional:())");
    assert
      .dom("span.uk-text-muted.uk-text-lowercase")
      .hasText("(t:caluma.form-builder.global.optional:())");
  });
});
