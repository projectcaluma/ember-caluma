import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-form-editor/question-list", function(
  hooks
) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    this.set("questions", [
      { node: { slug: "question-1", label: "Question 1?", type: "text" } },
      { node: { slug: "question-2", label: "Question 2?", type: "number" } }
    ]);

    await render(hbs`{{cfb-form-editor/question-list questions=questions}}`);

    assert.dom("[data-test-question-list-item]").exists({ count: 2 });
  });
});
