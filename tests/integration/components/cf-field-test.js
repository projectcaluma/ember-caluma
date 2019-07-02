import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import Document from "ember-caluma/lib/document";

module("Integration | Component | cf-field", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    const form = {
      __typename: "Form",
      slug: "some-form",
      questions: [
        {
          slug: "question-1",
          label: "Test",
          isRequired: "true",
          isHidden: "true",
          textMaxLength: 2,
          __typename: "TextQuestion"
        }
      ]
    };

    const document = Document.create(this.owner.ownerInjection(), {
      raw: {
        __typename: "Document",
        id: window.btoa("Document:1"),
        answers: [
          {
            stringValue: "Test",
            question: {
              slug: "question-1"
            },
            __typename: "StringAnswer"
          }
        ],
        rootForm: form,
        forms: [form]
      }
    });

    this.set("field", document.fields[0]);
  });

  test("it allows deleting existing input", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field field=field}}`);
    this.set("field.answer.value", "Test");

    await fillIn("input", "");
    assert.equal(this.field.answer.value, "", "Value was removed.");
  });

  test("it renders", async function(assert) {
    assert.expect(5);

    await render(hbs`{{cf-field field=field}}`);

    assert.dom(".uk-margin").exists();
    assert.dom(".uk-form-label").exists();
    assert.dom(".uk-form-controls").exists();

    assert.dom("label").hasText("Test");
    assert.dom("input[type=text]").hasValue("Test");
  });

  test("it renders disabled fields", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field field=field disabled=true}}`);

    assert.dom("input[type=text]").isDisabled();
  });

  test("it validates input", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field field=field}}`);

    await fillIn("input", "Test");

    assert
      .dom("span.validation-errors")
      .hasText("The value of this field can't be longer than 2 characters");
  });

  test("it hides the label", async function(assert) {
    this.set("field.meta", { hideLabel: true });

    await render(hbs`{{cf-field field=field}}`);

    assert.dom("uk-text-bold").doesNotExist();
  });
});
