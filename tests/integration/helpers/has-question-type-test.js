import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Helper | has-question-type", function (hooks) {
  setupRenderingTest(hooks);

  test("it works", async function (assert) {
    this.set("obj", { __typename: "DynamicChoiceQuestion" });
    this.set("expected", "dynamic-choice");

    await render(hbs`{{has-question-type obj expected}}`);

    assert.dom(this.element).hasText("true");
  });
});
