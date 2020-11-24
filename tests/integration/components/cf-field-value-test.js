import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cf-field-value", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders multiple choice questions", async function (assert) {
    this.set("field", {
      selected: [
        { slug: "option-a", label: "A" },
        { slug: "option-b", label: "B" },
      ],
      question: {
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
      answer: {
        value: ["option-a", "option-b"],
      },
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.dom(this.element).hasText("A, B");
  });

  test("it renders choice questions", async function (assert) {
    this.set("field", {
      selected: { slug: "option-c", label: "C" },
      question: {
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
      answer: {
        value: "option-c",
      },
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.dom(this.element).hasText("C");
  });

  test("it renders text questions", async function (assert) {
    this.set("field", {
      question: {
        __typename: "TextQuestion",
      },
      answer: {
        value: "foo",
      },
    });

    await render(hbs`{{cf-field-value field=field}}`);

    assert.dom(this.element).hasText("foo");
  });
});
