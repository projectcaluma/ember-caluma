import { render, click } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
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
    assert
      .dom("[data-test-add-field-button]")
      .hasText(this.intl.t("caluma.analytics.edit.add-field"));

    await click("button[data-test-add-field-button]");

    assert.dom("[data-test-add-field-form]").exists();
    assert.dom("input[name=alias]").exists();
    assert.dom("[data-test-field-select-primary-selector]").exists();
    assert.dom("button[data-test-form-cancel]").exists();
    assert.dom("button[data-test-form-submit]").isDisabled();
  });
});
