import { render, settled } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

class Question {
  @tracked isRequired = "true";
  @tracked isHidden = "true";

  slug = "test-question";
  label = "Test Question?";
  __typename = "TextQuestion";
}

module(
  "Integration | Component | cfb-form-editor/question-list/item",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      assert.expect(19);

      this.question = new Question();
      this.set("mode", "reorder");

      await render(hbs`
        <CfbFormEditor::QuestionList::Item
          @question={{this.question}}
          @mode={{this.mode}}
        />
      `);

      assert
        .dom("li")
        .hasText(
          "test-question Test Question? t:caluma.form-builder.question.types.TextQuestion:()"
        );

      assert
        .dom(".cfb-form-editor__question-list__item__required-required")
        .exists();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional-fill")
        .doesNotExist();

      this.question.isRequired = "false";
      await settled();

      assert
        .dom(".cfb-form-editor__question-list__item__required-required")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional-fill")
        .doesNotExist();

      this.question.isRequired = "1+2";
      await settled();

      assert
        .dom(".cfb-form-editor__question-list__item__required-required")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional")
        .exists();
      assert
        .dom(".cfb-form-editor__question-list__item__required-conditional-fill")
        .exists();

      assert
        .dom(".cfb-form-editor__question-list__item__hidden-hidden")
        .exists();
      assert
        .dom(".cfb-form-editor__question-list__item__hidden-conditional")
        .doesNotExist();

      this.question.isHidden = "false";
      await settled();

      assert
        .dom(".cfb-form-editor__question-list__item__hidden-hidden")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__hidden-conditional")
        .doesNotExist();

      this.question.isHidden = "1+2";
      await settled();

      assert
        .dom(".cfb-form-editor__question-list__item__hidden-hidden")
        .doesNotExist();
      assert
        .dom(".cfb-form-editor__question-list__item__hidden-conditional")
        .exists();

      assert.dom("[data-test-sort-handle]").exists();
      this.set("mode", "remove");
      assert.dom("[data-test-remove-item]").exists();
      this.set("mode", "add");
      assert.dom("[data-test-add-item]").exists();
    });
  }
);
