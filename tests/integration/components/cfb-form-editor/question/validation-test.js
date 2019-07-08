import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import Document from "ember-caluma/lib/document";
import hbs from "htmlbars-inline-precompile";
import { setupMirage } from "ember-cli-mirage/test-support";
import { settled } from "@ember/test-helpers";

module(
  "Integration | Component | cfb-form-editor/question/validation",
  function(hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function() {
      this.server.create("format-validator", { slug: "email" });

      const form = {
        __typename: "Form",
        slug: "some-form",
        questions: [
          {
            slug: "question-1",
            label: "Test",
            isRequired: "true",
            isHidden: "false",
            meta: {
              formatValidators: ["email"]
            },
            __typename: "TextQuestion"
          }
        ]
      };

      const document = Document.create(this.owner.ownerInjection(), {
        raw: {
          id: window.btoa("Document:1"),
          __typename: "Document",
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

    test("it shows error message", async function(assert) {
      assert.expect(1);
      let service = this.owner.lookup("service:validator");
      await settled();
      let error = service.validators.find(i => i.slug === "email").errorMsg;

      await render(hbs`{{cf-field field=field}}`);

      await fillIn("input", "Test");

      assert.dom("span.validation-errors").hasText(error);
    });

    test("it saves the valid email address", async function(assert) {
      assert.expect(1);
      let service = this.owner.lookup("service:validator");
      await settled();
      let error = service.validators.find(i => i.slug === "email").errorMsg;

      await render(hbs`{{cf-field field=field}}`);

      await fillIn("input", "test@test.com");

      assert.dom("span.validation-errors").hasText(error);
    });
  }
);
