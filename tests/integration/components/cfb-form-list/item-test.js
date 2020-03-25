import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cfb-form-list/item", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.set("form", {
      slug: "test",
      name: "Test",
      description: "Test",
    });

    await render(hbs`{{cfb-form-list/item item=form}}`);

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
      hbs`{{cfb-form-list/item item=form on-edit-form=(action editForm)}}`
    );

    await click("[data-test-edit-form]");

    assert.verifySteps(["edit-form"]);
  });
});
