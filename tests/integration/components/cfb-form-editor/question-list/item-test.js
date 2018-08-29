import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-form-editor/question-list/item", function(
  hooks
) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(1);

    this.set("question", {
      slug: "test-question",
      label: "Test Question?",
      type: "TEXT"
    });

    await render(hbs`{{cfb-form-editor/question-list/item question=question}}`);

    assert.dom("li").hasText("test-question Test Question? Text");
  });
});
