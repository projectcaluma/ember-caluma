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
    this.set("useMandatoryAsterisk", false);
  });

  test("it renders", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Label @field={{this.field}} />`);

    assert.dom("label").hasClass("uk-form-label");
    assert.dom("label").hasText("Test");
  });

  test("it marks optional fields as such", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<CfField::Label @field={{this.field}} @useMandatoryAsterisk={{this.useMandatoryAsterisk}} />`,
    );

    assert.dom("label").hasText("Test");

    this.set("field.question.raw.isRequired", "false");

    assert.dom("label").hasText("Test (Optional)");
  });

  test("it marks mandatory fields as such if useMandatoryAsterisk is configured", async function (assert) {
    assert.expect(1);
    this.set("useMandatoryAsterisk", true);

    await render(
      hbs`<CfField::Label @field={{this.field}} @useMandatoryAsterisk={{this.useMandatoryAsterisk}} />`,
    );
    this.set("field.question.raw.isRequired", "true");

    assert.dom("label").hasText("Test *");
  });

  test("it doesnt mark optional fields if useMandatoryAsterisk is configured true", async function (assert) {
    assert.expect(1);
    this.set("useMandatoryAsterisk", true);

    await render(
      hbs`<CfField::Label @field={{this.field}} @useMandatoryAsterisk={{this.useMandatoryAsterisk}} />`,
    );
    this.set("field.question.raw.isRequired", "false");

    assert.dom("label").hasText("Test");
  });
});
