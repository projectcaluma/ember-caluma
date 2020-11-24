import { render, settled } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | cfb-form-editor/question-list/item",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      assert.expect(6);

      this.set("question", {
        slug: "test-question",
        label: "Test Question?",
        isRequired: "true",
        __typename: "TextQuestion",
      });

      this.set("mode", "reorder");

      await render(hbs`
      {{cfb-form-editor/question-list/item question=question mode=mode}}
    `);

      assert
        .dom("li")
        .hasText(
          "test-question Test Question? t:caluma.form-builder.question.types.TextQuestion:()"
        );
      assert.dom(".cfb-form-editor__question-list__item__required").exists();

      this.set("question.isRequired", "false");
      await settled();

      assert
        .dom(".cfb-form-editor__question-list__item__required")
        .doesNotExist();

      assert.dom("[data-test-sort-handle]").exists();
      this.set("mode", "remove");
      assert.dom("[data-test-remove-item]").exists();
      this.set("mode", "add");
      assert.dom("[data-test-add-item]").exists();
    });
  }
);
