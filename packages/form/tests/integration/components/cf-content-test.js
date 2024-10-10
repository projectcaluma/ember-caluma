import { render, fillIn, click, triggerEvent } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { module, test } from "qunit";

import DummyOneComponent from "dummy/components/dummy-one";
import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-content", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const form = this.server.create("form");

    const questions = [
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXT",
        maxLength: 9999,
        minLength: 0,
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
        minDate: "2023-01-01",
        maxDate: "2030-12-31",
      }),
      this.server.create("question", {
        formIds: [form.id],
        type: "FILES",
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
    await render(hbs`<CfContent @documentId={{this.document.id}} />`);

    assert.dom("form").exists();

    const intl = this.owner.lookup("service:intl");

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
        answer.value.forEach((v) => {
          assert.dom(`[name="${id}"][value="${v}"]`).isChecked();
        });
      } else if (answer.type === "DATE") {
        assert.dom(`[name="${id}"]`).hasValue(answer.value);
        assert.dom(`[name="${id}"] + input`).hasValue(
          intl.formatDate(answer.value, {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        );
      } else if (answer.type === "FILES") {
        assert
          .dom(`[data-test-file-list]`)
          .containsText(answer.value?.[0]?.name);
      } else {
        assert.dom(`[name="${id}"]`).hasValue(String(answer.value));
      }
    });
  });

  test("it renders in disabled mode", async function (assert) {
    await render(
      hbs`<CfContent @disabled={{true}} @documentId={{this.document.id}} />`,
    );

    this.questions.forEach((question) => {
      const id = `Document:${this.document.id}:Question:${question.slug}`;
      const options = this.server.db.options.filter(({ questionIds }) =>
        questionIds.includes(question.id),
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
      } else if (question.type === "FILES") {
        assert.dom(`[name="${id}"]`).isDisabled();
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
      minDate: "2023-01-01",
      maxDate: null,
    });
    this.server.create("question", {
      formIds: [form.id],
      slug: "files-question",
      type: "FILES",
    });

    radioQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${radioQuestion.slug}-option-${i + 1}` });
    });

    checkboxQuestion.options.models.forEach((option, i) => {
      option.update({ slug: `${checkboxQuestion.slug}-option-${i + 1}` });
    });

    const document = this.server.create("document", { formId: form.id });

    this.set("documentId", document.id);

    await render(hbs`<CfContent @documentId={{this.documentId}} />`);

    await fillIn(
      `[name="Document:${document.id}:Question:text-question"]`,
      "Text",
    );
    await fillIn(
      `[name="Document:${document.id}:Question:textarea-question"]`,
      "Textarea",
    );
    await fillIn(
      `[name="Document:${document.id}:Question:integer-question"]`,
      1,
    );
    await fillIn(
      `[name="Document:${document.id}:Question:float-question"]`,
      1.1,
    );
    await click(
      `[name="Document:${document.id}:Question:radio-question"][value="radio-question-option-2"]`,
    );
    await click(
      `[name="Document:${document.id}:Question:checkbox-question"][value="checkbox-question-option-1"]`,
    );
    await click(
      `[name="Document:${document.id}:Question:checkbox-question"][value="checkbox-question-option-2"]`,
    );
    await setFlatpickrDate(
      `[name="Document:${document.id}:Question:date-question"]`,
      new Date(2023, 2, 25), // month is zero based
    );

    await triggerEvent(
      `[name="Document:${document.id}:Question:files-question"]`,
      "change",
      { files: [new File(["test"], "test.txt")] },
    );

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
          value: "2023-03-25",
        },
        {
          slug: "files-question",
          value: [],
          // This acutally should be the value underneath, but apollo replaces our uploadUrl
          // to "Hello World" and ruins the show this way. Afterwards a catch block will reset the
          // value to an empty array.
          // value: [{ name: "test.txt" }]
        },
      ],
    );
  });

  test("it allows for component overrides", async function (assert) {
    const options = this.owner.lookup("service:calumaOptions");
    options.registerComponentOverride({
      component: "dummy-one",
      componentClass: DummyOneComponent,
    });

    await render(hbs`<CfContent @documentId={{this.document.id}} />`);

    assert.dom(`[data-test-dummy-one]`).exists();
  });

  test("it allows overriding the save function", async function (assert) {
    assert.expect(4);

    const question = this.questions[0].slug;

    this.save = (field, value) => {
      assert.strictEqual(field.question.slug, question);
      assert.strictEqual(value, "My new value");
      assert.step("save");
    };

    await render(
      hbs`<CfContent @documentId={{this.document.id}} @onSave={{this.save}} />`,
    );

    await fillIn(
      `[name="Document:${this.document.id}:Question:${question}"]`,
      "My new value",
    );

    assert.verifySteps(["save"]);
  });
});
