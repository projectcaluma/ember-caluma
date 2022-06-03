import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | ca-field-form", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks, ["en"]);

  test("it renders", async function (assert) {
    this.analyticsTable = {
      id: 1,
      slug: "test",
      fields: { edges: [{ node: { alias: "existing field" } }] },
    };

    await render(hbs`<CaFieldForm @analyticsTable={{this.analyticsTable}} />`);

    await click("[data-test-add-field-button]");

    assert.dom(this.element).hasText("");
  });
});
