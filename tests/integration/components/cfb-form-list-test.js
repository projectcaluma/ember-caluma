import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { defineProperty } from "@ember/object";
import { task } from "ember-concurrency";

module("Integration | Component | cfb-form-list", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders blockless", async function (assert) {
    assert.expect(2);

    defineProperty(
      this,
      "data",
      task(function* () {
        return yield [
          { node: { id: 1, slug: "form-1", title: "Form 1" } },
          { node: { id: 2, slug: "form-2", title: "Form 2" } },
          { node: { id: 3, slug: "form-3", title: "Form 3" } },
          { node: { id: 4, slug: "form-4", title: "Form 4" } },
          { node: { id: 5, slug: "form-5", title: "Form 5" } },
        ];
      })
    );

    await render(hbs`{{cfb-form-list data=data}}`);

    assert.dom("[data-test-form-list]").exists();
    assert.dom("[data-test-form-list-item]").exists({ count: 5 });
  });

  test("it displays an empty state", async function (assert) {
    assert.expect(1);

    defineProperty(
      this,
      "data",
      task(function* () {
        return yield [];
      })
    );

    await render(hbs`{{cfb-form-list data=data}}`);

    assert.dom("[data-test-form-list-empty]").exists();
  });

  test("it can trigger editing of a row", async function (assert) {
    assert.expect(2);

    defineProperty(
      this,
      "data",
      task(function* () {
        return yield [{ node: { id: 1, slug: "form-1" } }];
      })
    );

    this.set("on-edit-form", () => assert.step("edit-form"));

    await render(
      hbs`{{cfb-form-list data=data on-edit-form=(action on-edit-form)}}`
    );

    await click(`[data-test-form-list-item=form-1] [data-test-edit-form]`);

    assert.verifySteps(["edit-form"]);
  });

  test("it can trigger adding a new form", async function (assert) {
    assert.expect(2);

    defineProperty(
      this,
      "data",
      task(function* () {
        return yield [{ node: { slug: "" } }];
      })
    );

    this.set("on-new-form", () => assert.step("new-form"));

    await render(
      hbs`{{cfb-form-list data=data on-new-form=(action on-new-form)}}`
    );

    await click("[data-test-new-form]");

    assert.verifySteps(["new-form"]);
  });
});
