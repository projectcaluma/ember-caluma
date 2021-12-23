import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | cf-content", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    const form = this.server.create("form");

    const questions = [
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXT",
        meta: { widgetOverride: "dummy-one" },
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXTAREA",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "INTEGER",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "FLOAT",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "CHOICE",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "MULTIPLE_CHOICE",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "DATE",
      }),
    ];

    const document = this.server.create("document", { formId: form.id });

    questions.forEach((question) => {
      this.server.create("answer", {
        questionId: question.id,
        documentId: document.id,
      });
    });

    this.set("questions", questions);
    this.set("document", document);
  });

  test("it renders", async function (assert) {
    await render(hbs`{{cf-content documentId=document.id}}`);

    assert.dom("form").exists();

    this.questions.forEach((question) => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const answer = this.server.db.answers.findBy({
        questionId: question.id,
        documentId: this.document.id,
      });

      if (question.type === "CHOICE") {
        const test = question.isArchived ? "isNotChecked" : "isChecked";
        assert.dom(`[name="${id}"][value="${answer.value}"]`)[test]();
      } else if (question.type === "MULTIPLE_CHOICE") {
        // checkbox options have their option slug postfixed to the name in
        // order to support IE11
        answer.value.forEach((v) => {
          assert.dom(`[name="${id}"][value="${v}"]`).isChecked();
        });
      } else if (answer.type === "DATE") {
        assert
          .dom(`[name="${id}"]`)
          .hasValue(moment(answer.value).format("DD.MM.YYYY"));
      } else {
        assert.dom(`[name="${id}"]`).hasValue(String(answer.value));
      }
    });
  });

  test("it renders in disabled mode", async function (assert) {
    await render(hbs`{{cf-content disabled=true documentId=document.id}}`);

    this.questions.forEach((question) => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const options = this.server.db.options.filter(({ questionIds }) =>
        questionIds.includes(question.id)
      );

      if (question.type === "CHOICE") {
        options
          .filter((option) => !option.isArchived)
          .forEach(({ slug }) => {
            assert.dom(`[name="${id}"][value="${slug}"]`).isDisabled();
          });
      } else if (question.type === "MULTIPLE_CHOICE") {
        options
          .filter((option) => !option.isArchived)
          .forEach(({ slug }) => {
            assert.dom(`[name="${id}"][value="${slug}"]`).isDisabled();
          });
      } else {
        assert.dom(`[name="${id}"]`).hasAttribute("readonly");
        assert.dom(`[name="${id}"]`).hasClass("uk-disabled");
      }
    });
  });

  test("it can save fields", async function (assert) {
    const form = this.server.create("form");

    this.server.create("question", {
      formIds: [form.id],
      slug: "text-question",
      type: "TEXT",
      maxLength: null,
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "textarea-question",
      type: "TEXTAREA",
      maxLength: null,
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "integer-question",
      type: "INTEGER",
      minValue: null,
      maxValue: null,
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "float-question",
      type: "FLOAT",
      minValue: null,
      maxValue: null,
    });
    const radioQuestion = this.server.create("question", {
      formIds: [form.id],
      slug: "radio-question",
      type: "CHOICE",
    });
    const checkboxQuestion = this.server.create("question", {
      formIds: [form.id],
      slug: "checkbox-question",
      type: "MULTIPLE_CHOICE",
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "date-question",
      type: "DATE",
    });
    // The following questions is commented-out as we currently have a
    // problem with GraphQL/Mirage and I didn't want to skip everything.
    /*
    this.server.create("question", {
      formIds: [form.id],
      slug: "file-question",
      type: "FILE"
    });
    */

    radioQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${radioQuestion.slug}-option-${i + 1}` });
    });

    checkboxQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${checkboxQuestion.slug}-option-${i + 1}` });
    });

    const document = this.server.create("document", { formId: form.id });

    this.set("documentId", document.id);

    await render(hbs`{{cf-content documentId=documentId}}`);

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
      `[name="Document:${document.id}:Question:radio-question"][value="radio-question-option-2"]`
    );
    await click(
      `[name="Document:${document.id}:Question:checkbox-question"][value="checkbox-question-option-1"]`
    );
    await click(
      `[name="Document:${document.id}:Question:checkbox-question"][value="checkbox-question-option-2"]`
    );
    await fillIn(
      `[name="Document:${document.id}:Question:date-question"]`,
      "25.03.2019"
    );
    // The following answers are commented-out as we currently have a
    // problem with GraphQL/Mirage and I didn't want to skip everything.
    /*
    await triggerEvent(
      `[name="Document:${document.id}:Question:file-question"]`,
      "change",
      [new File(["test"], "test.txt")]
    );
    */

    assert.deepEqual(
      this.server.schema.documents
        .find(document.id)
        .answers.models.map(({ value, question: { slug } }) => ({
          value,
          slug,
        })),
      [
        {
          slug: "text-question",
          value: "Text",
        },
        {
          slug: "textarea-question",
          value: "Textarea",
        },
        {
          slug: "integer-question",
          value: 1,
        },
        {
          slug: "float-question",
          value: 1.1,
        },
        {
          slug: "radio-question",
          value: "radio-question-option-2",
        },
        {
          slug: "checkbox-question",
          value: ["checkbox-question-option-1", "checkbox-question-option-2"],
        },
        {
          slug: "date-question",
          value: "2019-03-25",
        },
        // The following answers are commented-out as we currently have a
        // problem with GraphQL/Mirage and I didn't want to skip everything.
        /*,
        {
          slug: "file-question",
          value: { metadata: { object_name: "test.txt" } }
        }
        */
      ]
    );
  });

  test("it allows for component overrides", async function (assert) {
    const options = this.owner.lookup("service:calumaOptions");
    options.registerComponentOverride({ component: "dummy-one" });

    await render(hbs`{{cf-content documentId=document.id}}`);

    assert.dom(`[data-test-dummy-one]`).exists();
  });
});
