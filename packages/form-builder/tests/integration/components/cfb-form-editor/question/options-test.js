import { render, click } from "@ember/test-helpers";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import optionValidations from "@projectcaluma/ember-form-builder/validations/option";
import { setupRenderingTest } from "dummy/tests/helpers";

function optionChangeset({ slug, label, isArchived } = {}) {
  return new Changeset(
    {
      id: slug ?? undefined,
      label: label ?? "",
      slug: slug ?? "",
      isArchived: isArchived ?? false,
      question: "prefix",
      slugUnlinked: false,
    },
    lookupValidator(optionValidations),
    optionValidations,
  );
}

module(
  "Integration | Component | cfb-form-editor/question/options",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      this.model = { slug: "prefix" };
      this.noop = () => {};
      this.update = async (value) => {
        this.set("value", value);
      };
    });

    test("it renders", async function (assert) {
      assert.expect(3);

      this.value = [
        optionChangeset({ label: "Option 1", slug: "prefix-option-1" }),
        optionChangeset({ label: "Option 2", slug: "prefix-option-2" }),
      ];

      await render(
        hbs`<CfbFormEditor::Question::Options @model={{this.model}} @value={{this.value}} />`,
      );

      // one is the add row
      assert.dom("li").exists({ count: 3 });
      assert.dom("input[name=option-1-label]").hasValue("Option 1");
      assert.dom("input[name=option-1-slug]").hasValue("option-1"); // This must trim the prefix!
    });

    test("it can add row", async function (assert) {
      assert.expect(2);

      this.value = [
        optionChangeset({ label: "Option 1", slug: "prefix-option-1" }),
      ];

      await render(hbs`<CfbFormEditor::Question::Options
  @model={{this.model}}
  @value={{this.value}}
  @update={{this.update}}
  @setDirty={{this.noop}}
/>`);

      assert.dom("li").exists({ count: 2 });

      await click("[data-test-add-row]");

      assert.dom("li").exists({ count: 3 });
    });

    test("it can delete unsaved row", async function (assert) {
      assert.expect(3);

      this.value = [
        optionChangeset({ label: "Option 1", slug: "prefix-option-1" }),
        optionChangeset({ label: "Option 2", slug: "prefix-option-2" }),
      ];

      await render(hbs`<CfbFormEditor::Question::Options
  @model={{this.model}}
  @value={{this.value}}
  @update={{this.update}}
  @setDirty={{this.noop}}
/>`);

      assert.dom("li").exists({ count: 3 });

      await click("[data-test-add-row]");
      await click("[data-test-row=option-3] [data-test-delete-row]");

      assert.dom("li").exists({ count: 3 });
      assert.dom("[data-test-row=option-3]").doesNotExist();
    });

    test("it can archive/restore options", async function (assert) {
      assert.expect(3);

      this.value = [
        optionChangeset({ label: "Option 1", slug: "prefix-option-1" }),
        optionChangeset({ label: "Option 2", slug: "prefix-option-2" }),
      ];

      await render(
        hbs`<CfbFormEditor::Question::Options
  @model={{this.model}}
  @value={{this.value}}
  @update={{this.update}}
  @setDirty={{this.noop}}
/>`,
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
  },
);
