import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";
import { setupIntl } from "ember-intl/test-support";

module("Integration | Component | cf-field/label", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:validator", ValidatorServiceStub);

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

    const document = this.owner
      .factoryFor("caluma-model:document")
      .create({ raw });
    this.set("field", document.fields[0]);
  });

  test("it renders", async function (assert) {
    assert.expect(2);

    await render(hbs`{{cf-field/label field=field}}`);

    assert.dom("label").hasClass("uk-form-label");
    assert.dom("label").hasText("Test");
  });

  test("it marks optional fields as such", async function (assert) {
    assert.expect(2);

    await render(hbs`{{cf-field/label field=field}}`);

    assert.dom("label").hasText("Test");

    this.set("field.question.isRequired", "false");

    assert.dom("label").hasText("Test (t:caluma.form.optional:())");
  });
});
