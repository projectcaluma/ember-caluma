import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/label", function (hooks) {
  setupRenderingTest(hooks);

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
      { raw, owner: this.owner },
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

    assert.dom("label").hasText("Test (Optional)");
  });

  test("it marks mandatory fields as such if useMandatoryAsterisk is configured in attribute", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<CfField::Label @field={{this.field}} @useMandatoryAsterisk={{true}} />`,
    );

    this.set("field.question.raw.isRequired", "false");
    assert.dom("label").hasText("Test");

    this.set("field.question.raw.isRequired", "true");
    assert.dom("label").hasText("Test *");
  });

  test("it marks mandatory fields as such if useMandatoryAsterisk is globally configured", async function (assert) {
    this.owner.resolveRegistration("config:environment")["ember-caluma"] = {
      USE_MANDATORY_ASTERISK: true,
    };

    assert.expect(2);
    this.set("useMandatoryAsterisk", true);

    await render(hbs`<CfField::Label @field={{this.field}} />`);

    this.set("field.question.raw.isRequired", "false");
    assert.dom("label").hasText("Test");

    this.set("field.question.raw.isRequired", "true");
    assert.dom("label").hasText("Test *");
  });
});
