import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | cf-field/label", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    const form = {
      slug: "some-form",
      __typename: "Form",
      questions: [
        {
          slug: "question-1",
          label: "Test",
          isRequired: "true",
          isHidden: "true",
          __typename: "TextQuestion",
        },
      ],
    };

    const raw = {
      id: 1,
      __typename: "Document",
      answers: [],
      rootForm: form,
      forms: [form],
    };

    const document = new (this.owner.factoryFor("caluma-model:document").class)(
      { raw, owner: this.owner }
    );
    this.set("field", document.fields[0]);
  });

  test("it renders", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Label @field={{this.field}} />`);

    assert.dom("label").hasClass("uk-form-label");
    assert.dom("label").hasText("Test");
  });

  test("it marks optional fields as such", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Label @field={{this.field}} />`);

    assert.dom("label").hasText("Test");

    this.set("field.question.raw.isRequired", "false");

    assert.dom("label").hasText("Test (t:caluma.form.optional:())");
  });
});
