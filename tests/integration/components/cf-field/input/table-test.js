import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";

module("Integration | Component | cf-field/input/table", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.set("field", {
      pk: "table-test",
      answer: {
        value: [
          {
            fields: [
              {
                question: { __typename: "TextQuestion" },
                answer: { value: "Max" },
              },
              {
                question: { __typename: "TextQuestion" },
                answer: { value: "Muster" },
              },
            ],
          },
          {
            fields: [
              {
                question: { __typename: "TextQuestion" },
                answer: { value: "Bea" },
              },
              {
                question: { __typename: "TextQuestion" },
                answer: { value: "Beispiel" },
              },
            ],
          },
        ],
      },
      question: {
        rowForm: {
          questions: {
            edges: [
              { node: { label: "First name" } },
              { node: { label: "Last name" } },
            ],
          },
        },
      },
    });

    await render(hbs`{{cf-field/input/table field=field}}`);
    assert.dom("th:nth-of-type(1)").hasText("First name");
    assert.dom("th:nth-of-type(2)").hasText("Last name");

    assert.dom("tbody > tr > td:nth-of-type(1)").hasText("Max");
    assert.dom("tbody > tr > td:nth-of-type(2)").hasText("Muster");
  });
});
