import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import Document from "ember-caluma/lib/document";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Integration | Component | cf-field/label", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const form = {
      slug: "some-form",
      __typename: "Form",
      questions: [
        {
          slug: "question-1",
          label: "Test",
          isRequired: "true",
          isHidden: "true",
          __typename: "TextQuestion"
        }
      ]
    };

    const raw = {
      id: 1,
      __typename: "Document",
      answers: [],
      rootForm: form,
      forms: [form]
    };

    const document = Document.create(this.owner.ownerInjection(), { raw });
    this.set("field", document.fields[0]);
  });

  test("it renders", async function(assert) {
    assert.expect(2);

    await render(hbs`{{cf-field/label field=field}}`);

    assert.dom("label").hasClass("uk-form-label");
    assert.dom("label").hasText("Test");
  });

  test("it marks optional fields as such", async function(assert) {
    assert.expect(2);

    await render(hbs`{{cf-field/label field=field}}`);

    await this.field.optionalTask.perform();
    assert.dom("label").hasText("Test");

    this.set("field.question.isRequired", "false");

    await this.field.optionalTask.perform();
    await settled();

    assert.dom("label").hasText("Test (Optional)");
  });
});
