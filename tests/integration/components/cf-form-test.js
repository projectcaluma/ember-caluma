import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn, click, settled } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cf-form", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function() {
    const form = this.server.create("form");

    const questions = [
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXT"
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXTAREA"
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "INTEGER"
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "FLOAT"
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "CHOICE"
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "MULTIPLE_CHOICE"
      })
    ];

    const document = this.server.create("document", { formId: form.id });

    questions.forEach(question => {
      this.server.create("answer", {
        questionId: question.id,
        documentId: document.id
      });
    });

    this.set("questions", questions);
    this.set("document", document);
  });

  test("it renders", async function(assert) {
    await render(hbs`{{cf-form documentId=document.id}}`);

    assert.dom("form").exists();

    this.questions.forEach(question => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const answer = this.server.db.answers.findBy({
        questionId: question.id,
        documentId: this.document.id
      });

      if (question.type === "CHOICE") {
        assert.dom(`[name="${id}"][value="${answer.value}"]`).isChecked();
      } else if (question.type === "MULTIPLE_CHOICE") {
        answer.value.forEach(v => {
          assert.dom(`[name="${id}"][value="${v}"]`).isChecked();
        });
      } else {
        assert.dom(`[name="${id}"]`).hasValue(String(answer.value));
      }
    });
  });

  test("it renders in disabled mode", async function(assert) {
    await render(hbs`{{cf-form disabled=true documentId=document.id}}`);

    this.questions.forEach(question => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const options = this.server.db.options.filter(({ questionIds }) =>
        questionIds.includes(question.id)
      );

      if (["CHOICE", "MULTIPLE_CHOICE"].includes(question.type)) {
        options.forEach(({ slug }) => {
          assert.dom(`[name="${id}"][value="${slug}"]`).isDisabled();
        });
      } else {
        assert.dom(`[name="${id}"]`).isDisabled();
      }
    });
  });

  test("it can save fields", async function(assert) {
    const form = this.server.create("form");

    this.server.create("question", {
      formIds: [form.id],
      slug: "text-question",
      type: "TEXT",
      maxLength: null
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "textarea-question",
      type: "TEXTAREA",
      maxLength: null
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "integer-question",
      type: "INTEGER",
      minValue: null,
      maxValue: null
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "float-question",
      type: "FLOAT",
      minValue: null,
      maxValue: null
    });
    const radioQuestion = this.server.create("question", {
      formIds: [form.id],
      slug: "radio-question",
      type: "CHOICE"
    });
    const checkboxQuestion = this.server.create("question", {
      formIds: [form.id],
      slug: "checkbox-question",
      type: "MULTIPLE_CHOICE"
    });

    radioQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${radioQuestion.slug}-option-${i + 1}` });
    });

    checkboxQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${checkboxQuestion.slug}-option-${i + 1}` });
    });

    const document = this.server.create("document", { formId: form.id });

    this.set("documentId", document.id);

    await render(hbs`{{cf-form documentId=documentId}}`);

    await fillIn(
      `[name="Document:${document.id}:Question:text-question"]`,
      "Text"
    );
    await fillIn(
      `[name="Document:${document.id}:Question:textarea-question"]`,
      "Textarea"
    );
    await fillIn(
      `[name="Document:${document.id}:Question:integer-question"]`,
      1
    );
    await fillIn(
      `[name="Document:${document.id}:Question:float-question"]`,
      1.1
    );
    await click(
      `[name="Document:${
        document.id
      }:Question:radio-question"][value="radio-question-option-2"]`
    );
    await click(
      `[name="Document:${
        document.id
      }:Question:checkbox-question"][value="checkbox-question-option-1"]`
    );
    await click(
      `[name="Document:${
        document.id
      }:Question:checkbox-question"][value="checkbox-question-option-2"]`
    );

    await settled();

    assert.deepEqual(
      this.server.schema.documents
        .find(document.id)
        .answers.models.map(({ value, question: { slug } }) => ({
          value,
          slug
        })),
      [
        {
          slug: "text-question",
          value: "Text"
        },
        {
          slug: "textarea-question",
          value: "Textarea"
        },
        {
          slug: "integer-question",
          value: 1
        },
        {
          slug: "float-question",
          value: 1.1
        },
        {
          slug: "radio-question",
          value: "radio-question-option-2"
        },
        {
          slug: "checkbox-question",
          value: ["checkbox-question-option-1", "checkbox-question-option-2"]
        }
      ]
    );
  });

  test("it allows for component overrides", async function(assert) {
    await render(hbs`{{cf-form 
      documentId=document.id 
      overrides=(hash question-1=(component "override"))
    }}`);

    assert.dom(`[data-test-component-override]`).exists();
  });
});
