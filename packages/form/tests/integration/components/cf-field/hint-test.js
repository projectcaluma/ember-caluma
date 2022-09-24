import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | cf-field/hint", function (hooks) {
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
          hintText: "Test",
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
    this.field = document.fields[0];
  });

  test("it renders", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Hint @field={{this.field}} />`);

    assert.dom(`div[data-test-field-hint='${this.field.pk}']`).exists();
    assert.dom(`div[data-test-field-hint='${this.field.pk}']`).hasText("Test");
  });
});
