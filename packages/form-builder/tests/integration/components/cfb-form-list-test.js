import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-form-list", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.before(function () {
    this.noop = () => {};
  });

  test("it renders blockless", async function (assert) {
    assert.expect(2);

    this.server.createList("form", 5);

    await render(
      hbs`<CfbFormList @onUpdateSearch={{this.noop}} @onUpdateCategory={{this.noop}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-form-list]").exists();
    assert.dom("[data-test-form-list-item]").exists({ count: 5 });
  });

  test("it displays an empty state", async function (assert) {
    assert.expect(1);

    await render(
      hbs`<CfbFormList @onUpdateSearch={{this.noop}} @onUpdateCategory={{this.noop}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-form-list-empty]").exists();
  });

  test("it can trigger editing of a row", async function (assert) {
    assert.expect(2);

    this.server.create("form", { id: 1, slug: "form-1" });

    this.set("onEditForm", () => assert.step("edit-form"));

    await render(
      hbs`<CfbFormList
  @onUpdateSearch={{this.noop}}
  @onUpdateCategory={{this.noop}}
  @onEditForm={{this.onEditForm}}
/>`,
      { owner: this.engine },
    );

    await click(`[data-test-form-list-item=form-1] [data-test-edit-form]`);

    assert.verifySteps(["edit-form"]);
  });

  test("it can trigger adding a new form", async function (assert) {
    assert.expect(2);

    this.server.create("form", { slug: "" });

    this.set("onNewForm", () => assert.step("new-form"));

    await render(
      hbs`<CfbFormList
  @onUpdateSearch={{this.noop}}
  @onUpdateCategory={{this.noop}}
  @onNewForm={{this.onNewForm}}
/>`,
      { owner: this.engine },
    );

    await click("[data-test-new-form]");

    assert.verifySteps(["new-form"]);
  });

  test("it displays archived forms", async function (assert) {
    assert.expect(3);

    this.category = "active";

    this.server.create("form", {
      id: 1,
      slug: "form-1",
      title: "Form 1",
      isArchived: true,
    });

    await render(
      hbs`<CfbFormList
  @category={{this.category}}
  @onUpdateSearch={{this.noop}}
  @onUpdateCategory={{fn (mut this.category)}}
/>`,
      { owner: this.engine },
    );

    assert.dom("[data-test-form-list-empty]").exists();

    await click("[data-test-filter=archived]");

    assert.dom("[data-test-form-list]").exists();
    assert.dom("[data-test-form-list-item]").exists({ count: 1 });
  });
});
