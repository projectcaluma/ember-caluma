import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/text", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("it computes the proper element id", async function (assert) {
    await render(hbs`<CfField::Input::Text @field={{hash pk="test-id"}} />`);

    assert.dom("#test-id").exists();
  });

  test("it renders", async function (assert) {
    assert.expect(4);

    await render(hbs`<CfField::Input::Text
  @field={{hash
    pk="test"
    answer=(hash value="Test")
    question=(hash textMaxLength=5)
  }}
/>`);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "text");
    assert.dom("input").hasValue("Test");
  });

  test("it can be disabled", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input::Text @disabled={{true}} />`);

    assert.dom("input").hasAttribute("readonly");
    assert.dom("input").hasClass("uk-disabled");
  });

  test("it triggers save on input", async function (assert) {
    assert.expect(1);

    this.set("save", (value) => assert.strictEqual(value, "Test"));

    await render(hbs`<CfField::Input::Text @onSave={{this.save}} />`);

    await fillIn("input", "Test");
  });

  test("it displays refreshed value", async function (assert) {
    const form = this.server.create("form", { slug: "some-form" });
    const question = this.server.create("question", {
      type: "TEXT",
      slug: "question-1",
      label: "Apple",
      isRequired: "true",
      isHidden: "false",
      formIds: [form.id],
    });
    const document = this.server.create("document", { formId: form.id });
    const answerValue = "Test";
    const answer = this.server.create("answer", {
      questionId: question.id,
      documentId: document.id,
      value: answerValue,
    });

    const rawForm = {
      __typename: "Form",
      slug: "some-form",
      questions: [
        {
          slug: "question-1",
          label: "Apple",
          isRequired: "true",
          isHidden: "false",
          textMinLength: 10,
          textMaxLength: 20,
          meta: {},
          __typename: "TextareaQuestion",
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
            stringValue: answerValue,
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

    await render(hbs`<CfField::Input::Textarea @field={{this.field}} />`);

    assert.dom("textarea").hasValue(answerValue);

    answer.update({ value: "Beer" });

    assert.dom("textarea").hasValue(answerValue);

    await this.field.refreshAnswer.perform();

    assert.dom("textarea").hasValue("Beer");
  });
});
