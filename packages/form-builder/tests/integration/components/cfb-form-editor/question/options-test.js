import { render, click, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | cfb-form-editor/question/options",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      assert.expect(3);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [
          { node: { slug: "prefix-option-1", label: "Option 1" } },
          { node: { slug: "prefix-option-2", label: "Option 2" } },
        ],
      });

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}}/>`
      );

      // one is the add row
      assert.dom("li").exists({ count: 3 });
      assert.dom("input[name=option-1-label]").hasValue("Option 1");
      assert.dom("input[name=option-1-slug]").hasValue("option-1"); // This must trim the prefix!
    });

    test("it renders an empty row per default", async function (assert) {
      assert.expect(4);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [],
      });

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}}/>`
      );

      assert.dom("li").exists({ count: 2 });
      assert.dom("input[name=option-1-label]").hasValue("");
      assert.dom("input[name=option-1-slug]").hasValue("");
      assert.dom("[data-test-delete-row]").doesNotExist();
    });

    test("it can add row", async function (assert) {
      assert.expect(1);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [],
      });
      this.set("noop", () => {});

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}} @update={{this.noop}} @setDirty={{this.noop}}/>`
      );

      await click("[data-test-add-row]");

      assert.dom("li").exists({ count: 3 });
    });

    test("it can delete unsaved row", async function (assert) {
      assert.expect(3);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [
          { node: { slug: "prefix-option-1", label: "Option 1" } },
          { node: { slug: "prefix-option-2", label: "Option 2" } },
        ],
      });
      this.set("noop", () => {});

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}} @update={{this.noop}} @setDirty={{this.noop}}/>`
      );

      assert.dom("li").exists({ count: 3 });

      await click("[data-test-add-row]");
      await click("[data-test-row=option-3] [data-test-delete-row]");

      assert.dom("li").exists({ count: 3 });
      assert.dom("[data-test-row=option-3]").doesNotExist();
    });

    test("it can update", async function (assert) {
      assert.expect(3);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [{ node: { slug: "prefix-option-1", label: "Option 1" } }],
      });

      this.set("update", () => {});
      this.set("setDirty", () => {});

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}} @update={{this.update}} @setDirty={{this.setDirty}}/>`
      );

      // add some new rows (only one will be filled)
      await click("[data-test-add-row]");
      await click("[data-test-add-row]");
      await click("[data-test-add-row]");

      assert.dom("li").exists({ count: 5 });

      await fillIn("input[name=option-1-label]", "Option #1");
      await fillIn("input[name=option-2-label]", "Option 2");

      // assert.dom("input[name=option-2-slug]").hasValue("option-2");

      this.set("update", (value) => {
        // empty rows will be omitted
        assert.deepEqual(value, {
          edges: [
            {
              node: {
                label: "Option #1",
                slug: "prefix-option-1",
                isArchived: false,
              },
            },
            {
              node: {
                label: "Option 2",
                slug: "prefix-x-option-2",
                isArchived: false,
              },
            },
          ],
        });
      });
      this.set("setDirty", () => assert.ok(true));

      await fillIn("input[name=option-2-slug]", "x-option-2");
    });

    test("it can archive/restore options", async function (assert) {
      assert.expect(3);

      this.set("model", { slug: "prefix" });
      this.set("value", {
        edges: [
          { node: { slug: "prefix-option-1", label: "Option 1" } },
          { node: { slug: "prefix-option-2", label: "Option 2" } },
        ],
      });
      this.set("noop", () => {});

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}} @update={{this.noop}} @setDirty={{this.noop}}/>`
      );

      assert.dom("[data-test-row]").exists({ count: 2 });

      // Archive option
      await click("[data-test-row=option-1] [data-test-archive-row]");

      assert
        .dom("[data-test-row=option-1] input[name=option-1-label]")
        .isDisabled();

      // Restore option
      await click("[data-test-row=option-1] [data-test-archive-row]");

      assert
        .dom("[data-test-row=option-1] input[name=option-1-label]")
        .isNotDisabled();
    });
  }
);
