import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field-value", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

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

  test("it renders file questions", async function (assert) {
    const file = this.server.create("file");

    this.field = {
      questionType: "FilesQuestion",
      question: {
        raw: {
          __typename: "FilesQuestion",
        },
      },
      answer: {
        value: [file],
      },
    };

    await render(hbs`<CfFieldValue @field={{this.field}} />`);

    assert.dom(this.element).hasText(file.name);
  });

  test("it renders numbers using the number-separator widget override", async function (assert) {
    setLocale(["de-ch", "de"]);

    this.field = {
      questionType: "FloatQuestion",
      question: {
        useNumberSeparatorWidget: true,
      },
      answer: {
        value: 1111111.111111,
      },
    };

    await render(hbs`<CfFieldValue @field={{this.field}} />`);

    assert.dom(this.element).hasText("1’111’111.111111");
  });
});
