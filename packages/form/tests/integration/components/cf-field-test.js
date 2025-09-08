import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const formatValidator = this.server.create("format-validator", {
      slug: "some-validator",
    });
    const form = this.server.create("form", { slug: "some-form" });
    const question = this.server.create("question", {
      type: "TEXT",
      slug: "question-1",
      label: "Test",
      isRequired: "true",
      isHidden: "false",
      minLength: 10,
      maxLength: 20,
      formIds: [form.id],
    });
    this.server.create("question", {
      type: "TEXT",
      slug: "question-2",
      label: "Test2",
      isRequired: "true",
      isHidden: "false",
      formIds: [form.id],
      formatValidatorIds: [formatValidator.id],
    });
    const document = this.server.create("document", { formId: form.id });
    this.server.create("answer", {
      questionId: question.id,
      documentId: document.id,
      value: "Test",
    });

    const rawForm = {
      __typename: "Form",
      slug: "some-form",
      questions: [
        {
          slug: "question-1",
          label: "Test",
          isRequired: "true",
          isHidden: "false",
          textMinLength: 10,
          textMaxLength: 20,
          meta: {},
          __typename: "TextQuestion",
        },
        {
          slug: "question-2",
          label: "Test2",
          isRequired: "true",
          isHidden: "false",
          meta: {},
          formatValidators: {
            edges: [
              {
                node: {
                  slug: "some-validator",
                },
              },
            ],
          },
          __typename: "TextQuestion",
        },
      ],
    };

    const rawDocument = new (this.owner.factoryFor(
      "caluma-model:document",
    ).class)({
      raw: {
        __typename: "Document",
        id: window.btoa(`Document:${document.id}`),
        answers: [
          {
            stringValue: "Test",
            question: {
              slug: "question-1",
            },
            __typename: "StringAnswer",
          },
        ],
        rootForm: rawForm,
        forms: [rawForm],
      },
      owner: this.owner,
    });

    this.field = rawDocument.fields[0];
    this.errorField = rawDocument.fields[1];
  });

  test("it allows deleting existing input", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfField @field={{this.field}} />`);
    this.set("field.answer.value", "Test");

    await fillIn("input", "");
    assert.strictEqual(this.field.answer.value, null, "Value was removed.");
  });

  test("it renders", async function (assert) {
    assert.expect(5);

    await render(hbs`<CfField @field={{this.field}} />`);

    assert.dom(".uk-margin").exists();
    assert.dom(".uk-form-label").exists();
    assert.dom(".uk-form-controls").exists();

    assert.dom("label").hasText("Test");
    assert.dom("input[type=text]").hasValue("Test");
  });

  test("it renders disabled fields", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField @field={{this.field}} @disabled={{true}} />`);

    assert.dom("input[type=text]").hasAttribute("readonly");
    assert.dom("input[type=text]").hasClass("uk-disabled");
  });

  test("it validates input", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfField @field={{this.field}} />`);

    await fillIn("input", "Test");

    assert
      .dom("span.validation-errors")
      .hasText("The value of this field can't be shorter than 10 characters");
  });

  test("it hides the label", async function (assert) {
    this.set("field.meta", { hideLabel: true });

    await render(hbs`<CfField @field={{this.field}} />`);

    assert.dom("uk-text-bold").doesNotExist();
  });

  test("it shows format validator error message raised by backend", async function (assert) {
    assert.expect(1);

    this.server.post("/graphql/", () => {
      return {
        errors: [
          {
            message: "Backend says no",
            extensions: { code: "format_validation_failed" },
          },
        ],
      };
    });

    await render(hbs`<CfField @field={{this.errorField}} />`);

    await fillIn("input", "Test");

    assert.dom("span.validation-errors").hasText("Backend says no");
  });
});
