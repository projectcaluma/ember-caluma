import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cfb-form-list", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("it renders blockless", async function (assert) {
    assert.expect(2);

    this.server.createList("form", 5);

    await render(hbs`<CfbFormList/>`);

    assert.dom("[data-test-form-list]").exists();
    assert.dom("[data-test-form-list-item]").exists({ count: 5 });
  });

  test("it displays an empty state", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfbFormList/>`);

    assert.dom("[data-test-form-list-empty]").exists();
  });

  test("it can trigger editing of a row", async function (assert) {
    assert.expect(2);

    this.server.create("form", { id: 1, slug: "form-1" });

    this.set("onEditForm", () => assert.step("edit-form"));

    await render(hbs`<CfbFormList @onEditForm={{this.onEditForm}}/>`);

    await click(`[data-test-form-list-item=form-1] [data-test-edit-form]`);

    assert.verifySteps(["edit-form"]);
  });

  test("it can trigger adding a new form", async function (assert) {
    assert.expect(2);

    this.server.create("form", { slug: "" });

    this.set("onNewForm", () => assert.step("new-form"));

    await render(hbs`<CfbFormList @onNewForm={{this.onNewForm}}/>`);

    await click("[data-test-new-form]");

    assert.verifySteps(["new-form"]);
  });

  test("it displays archived forms", async function (assert) {
    assert.expect(3);

    this.server.create("form", {
      id: 1,
      slug: "form-1",
      title: "Form 1",
      isArchived: true,
    });

    await render(hbs`<CfbFormList/>`);

    assert.dom("[data-test-form-list-empty]").exists();

    await click("[data-test-filter=archived]");

    assert.dom("[data-test-form-list]").exists();
    assert.dom("[data-test-form-list-item]").exists({ count: 1 });
  });
});
