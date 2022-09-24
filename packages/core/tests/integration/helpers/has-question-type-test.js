import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Helper | has-question-type", function (hooks) {
  setupRenderingTest(hooks);

  test("it works", async function (assert) {
    this.set("obj", { __typename: "DynamicChoiceQuestion" });
    this.set("expected", "dynamic-choice");

    await render(hbs`{{has-question-type this.obj this.expected}}`);

    assert.dom(this.element).hasText("true");
  });
});
