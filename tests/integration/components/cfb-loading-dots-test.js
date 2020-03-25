import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";

module("Integration | Component | cfb-loading-dots", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    await render(hbs`{{cfb-loading-dots}}`);

    assert.dom("span").hasText("t:caluma.form-builder.global.loading:()...");

    await render(hbs`{{#cfb-loading-dots}}Test{{/cfb-loading-dots}}`);

    assert.dom("span").hasText("Test...");
  });
});
