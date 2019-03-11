import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/table", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    this.set("field", {
      id: "table-test",
      answer: {
        rowDocuments: [
          {
            fields: [
              { answer: { value: "Max" } },
              { answer: { value: "Muster" } }
            ]
          },
          {
            fields: [
              { answer: { value: "Bea" } },
              { answer: { value: "Beispiel" } }
            ]
          }
        ]
      },
      question: {
        rowForm: {
          questions: {
            edges: [
              { node: { label: "First name" } },
              { node: { label: "Last name" } }
            ]
          }
        }
      }
    });

    await render(hbs`{{cf-field/input/table field=field}}`);
    assert.dom("th:nth-of-type(1)").hasText("First name");
    assert.dom("th:nth-of-type(2)").hasText("Last name");

    assert.dom("tbody > tr > td:nth-of-type(1)").hasText("Max");
    assert.dom("tbody > tr > td:nth-of-type(2)").hasText("Muster");
  });
});
