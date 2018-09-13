import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-form-editor/question-list/item", function(
  hooks
) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(3);

    this.set("question", {
      slug: "test-question",
      label: "Test Question?",
      type: "TEXT",
      isRequired: "true"
    });

    await render(hbs`{{cfb-form-editor/question-list/item question=question}}`);

    assert.dom("li").hasText("test-question Test Question? Text");
    assert.dom(".cfb-form-editor__question-list__item__required").exists();

    this.set("question.isRequired", "false");
    await settled();

    assert
      .dom(".cfb-form-editor__question-list__item__required")
      .doesNotExist();
  });
});
