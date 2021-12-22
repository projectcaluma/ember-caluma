import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cf-field-value", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders multiple choice questions", async function (assert) {
    this.field = {
      selected: [
        { slug: "option-a", label: "A" },
        { slug: "option-b", label: "B" },
      ],
      questionType: "MultipleChoiceQuestion",
      question: {
        raw: {
          __typename: "MultipleChoiceQuestion",
          multipleChoiceOptions: {
            edges: [
              {
                node: {
                  slug: "option-a",
                  label: "A",
                },
              },
              {
                node: {
                  slug: "option-b",
                  label: "B",
                },
              },
              {
                node: {
                  slug: "option-c",
                  label: "C",
                },
              },
            ],
          },
        },
      },
      answer: {
        value: ["option-a", "option-b"],
      },
    };

    await render(hbs`<CfFieldValue @field={{this.field}} />`);

    assert.dom(this.element).hasText("A, B");
  });

  test("it renders choice questions", async function (assert) {
    this.field = {
      selected: { slug: "option-c", label: "C" },
      questionType: "ChoiceQuestion",
      question: {
        raw: {
          __typename: "ChoiceQuestion",
          choiceOptions: {
            edges: [
              {
                node: {
                  slug: "option-a",
                  label: "A",
                },
              },
              {
                node: {
                  slug: "option-b",
                  label: "B",
                },
              },
              {
                node: {
                  slug: "option-c",
                  label: "C",
                },
              },
            ],
          },
        },
      },
      answer: {
        value: "option-c",
      },
    };

    await render(hbs`<CfFieldValue @field={{this.field}} />`);

    assert.dom(this.element).hasText("C");
  });

  test("it renders text questions", async function (assert) {
    this.field = {
      questionType: "TextQuestion",
      question: {
        raw: {
          __typename: "TextQuestion",
        },
      },
      answer: {
        value: "foo",
      },
    };

    await render(hbs`<CfFieldValue @field={{this.field}} />`);

    assert.dom(this.element).hasText("foo");
  });
});
