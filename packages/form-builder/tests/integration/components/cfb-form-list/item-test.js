import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-form-list/item", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.set("form", {
      slug: "test",
      name: "Test",
      description: "Test",
    });

    await render(hbs`<CfbFormList::Item @item={{this.form}}/>`);

    assert.dom("li").exists();
    assert.dom("li > span:nth-child(1)").hasText("Test");
    assert.dom("li > span:nth-child(2)").hasText("Test");
  });

  test("it can trigger on-edit-form action", async function (assert) {
    this.set("form", {
      slug: "test",
      name: "Test",
      description: "Test",
    });

    this.set("editForm", () => assert.step("edit-form"));

    await render(
      hbs`<CfbFormList::Item @item={{this.form}} @on-edit-form={{this.editForm}}/>`
    );

    await click("[data-test-edit-form]");

    assert.verifySteps(["edit-form"]);
  });
});
