import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | cfb-form-editor/question/default/table",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      this.field = {
        question: { raw: { meta: {}, rowForm: { questions: { edges: [] } } } },
      };

      await render(
        hbs`<CfbFormEditor::Question::Default::Table @field={{this.field}} />`
      );

      assert.dom(this.element).exists();
    });
  }
);
