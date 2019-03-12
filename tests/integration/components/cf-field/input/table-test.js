import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cf-field/input/table", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
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
        __typename: "TableQuestion",
        rowForm: {
          questions: {
            edges: [
              {
                node: {
                  __typename: "TextQuestion",
                  slug: "first-name",
                  label: "First name"
                }
              },
              {
                node: {
                  __typename: "TextQuestion",
                  slug: "last-name",
                  label: "Last name"
                }
              }
            ]
          }
        }
      }
    });
  });

  test("it renders", async function(assert) {
    await render(hbs`{{cf-field/input/table field=field}}`);
    assert.dom("th:nth-of-type(1)").hasText("First name");
    assert.dom("th:nth-of-type(2)").hasText("Last name");

    assert.dom("tbody > tr > td:nth-of-type(1)").hasText("Max");
    assert.dom("tbody > tr > td:nth-of-type(2)").hasText("Muster");
  });

  test("it can add rows", async function(assert) {
    assert.expect(1);

    await render(hbs`
      {{cf-field/input
        field=field
      }}
    `);

    await click("button:nth-of-type(1)");

    await settled();

    assert.equal(this.get("showModal"), true);
  });
});
