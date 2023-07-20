import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-form-list/item", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.set("form", {
      slug: "test",
      name: "Test",
      description: "Test",
    });

    await render(hbs`<CfbFormList::Item @item={{this.form}} />`);

    assert.dom("li").exists();
    assert.dom("li > span:nth-child(1)").hasText("Test");
    assert.dom("li > span:nth-child(2)").hasText("Test");
  });

  test("it can trigger onEditForm action", async function (assert) {
    this.set("form", {
      slug: "test",
      name: "Test",
      description: "Test",
    });

    this.set("editForm", () => assert.step("edit-form"));

    await render(
      hbs`<CfbFormList::Item @item={{this.form}} @onEditForm={{this.editForm}} />`,
    );

    await click("[data-test-edit-form]");

    assert.verifySteps(["edit-form"]);
  });
});
