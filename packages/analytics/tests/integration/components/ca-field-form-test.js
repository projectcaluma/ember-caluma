import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | ca-field-form", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.analyticsTable = {
      id: 1,
      slug: "test",
      fields: { edges: [{ node: { alias: "existing field" } }] },
    };

    await render(hbs`<CaFieldForm @analyticsTable={{this.analyticsTable}} />`, {
      owner: this.engine,
    });
    assert.dom("[data-test-add-field-button]").hasText("Add field");

    await click("button[data-test-add-field-button]");

    assert.dom("[data-test-add-field-form]").exists();
    assert.dom("input[name=alias]").exists();
    assert.dom("[data-test-field-select-primary-selector]").exists();
    assert.dom("button[data-test-form-cancel]").exists();
    assert.dom("button[data-test-form-submit]").isDisabled();
  });
});
