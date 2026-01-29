import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import cloneDeep from "lodash.clonedeep";
import { module, test } from "qunit";

import { decodeId } from "@projectcaluma/ember-core/helpers/decode-id";
import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { rawHistoricalDocumentWithCase } from "dummy/tests/unit/lib/data";

module("Integration | Component | compare", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    const form = this.server.create("form");

    const questions = [
      this.server.create("question", {
        formIds: [form.id],
        type: "TEXT",
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

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    const toDate = new Date();

    this.set("compare", { from: fromDate, to: toDate });

    this.rawHistoricalDocument = cloneDeep(rawHistoricalDocumentWithCase);
    this.set(
      "rawHistoricalDocument.form.questions.edges",
      this.rawHistoricalDocument.form.questions.edges.map((q) => {
        return {
          ...q,
          node: {
            ...q.node,
            isHidden: "false",
            isRequired: "false",
          },
        };
      }),
    );

    this.rawDocument = new (this.owner.factoryFor(
      "caluma-model:document",
    ).class)({
      raw: parseDocument(this.rawHistoricalDocument),
      historicalDocument: parseDocument(this.rawHistoricalDocument),
      compare: this.compare,
      owner: this.owner,
    });
    this.documentId = decodeId(this.rawHistoricalDocument.id);

    this.findField = (questionSlug) => {
      return this.rawDocument.fields.find(
        (f) => f.raw.question.slug === questionSlug,
      );
    };
  });

  test("cf-field renders a text widget compare diff", async function (assert) {
    this.field = this.findField("question-1");

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert.dom(`[name="${this.field.pk}"]`).hasValue("test answer");
    assert.dom(`.uk-input .diff-from-version`).doesNotExist();
    assert.dom(`.uk-input .diff-to-version`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.value", "changed answer");
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[name="${this.field.pk}"]`).hasValue("changed answer");
    assert.dom(`.uk-input .diff-from-version`).hasText("test answer");
    assert.dom(`.uk-input .diff-to-version`).hasText("changed answer");
  });

  test("cf-field renders a textarea widget compare diff", async function (assert) {
    this.field = this.findField("question-2");

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert.dom(`[name="${this.field.pk}"]`).hasValue("test answer 2");
    assert.dom(`.uk-textarea .diff-from-version`).doesNotExist();
    assert.dom(`.uk-textarea .diff-to-version`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.value", "changed answer 2");
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[name="${this.field.pk}"]`).hasValue("changed answer 2");
    assert.dom(`.uk-textarea .diff-from-version`).hasText("test answer 2");
    assert.dom(`.uk-textarea .diff-to-version`).hasText("changed answer 2");
  });

  test("cf-field renders a float widget compare diff", async function (assert) {
    this.field = this.findField("float");

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert.dom(`[name="${this.field.pk}"]`).hasValue("1.1");
    assert.dom(`.uk-input .diff-from-version`).doesNotExist();
    assert.dom(`.uk-input .diff-to-version`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.value", 2.2);
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[name="${this.field.pk}"]`).hasValue("2.2");
    assert.dom(`.uk-input .diff-from-version`).hasText("1.1");
    assert.dom(`.uk-input .diff-to-version`).hasText("2.2");
  });

  test("cf-field renders a calculated float widget compare diff", async function (assert) {
    this.floatField = this.findField("float");
    this.field = this.findField("calculated");
    this.set("field.answer.raw.calculatedFloatValue", 4.4);
    this.set("field.answer.historical.calculatedFloatValue", 4.4);
    this.set("field.question.raw.calcExpression", '"float"|answer * 2');

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert.dom(`[name="${this.field.pk}"]`).hasValue("2.2");
    assert.dom(`.uk-input .diff-from-version`).doesNotExist();
    assert.dom(`.uk-input .diff-to-version`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.historical.calculatedFloatValue", 2.2);
    this.set("floatField.answer.value", 2.2);
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );

    assert.dom(`[name="${this.field.pk}"]`).hasValue("4.4");
    assert.dom(`.uk-input .diff-from-version`).hasText("2.2");
    assert.dom(`.uk-input .diff-to-version`).hasText("4.4");
  });

  test("cf-field renders a choice widget compare diff", async function (assert) {
    this.field = this.findField("choice");

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"]`)
      .exists({ count: 4 });
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="radio-a"]`)
      .isChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="radio-b"]`)
      .isNotChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="radio-c"]`)
      .isNotChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="radio-d"]`)
      .isNotChecked();
    assert.dom(`.combined-diff`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.value", "radio-c");
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`.combined-diff`).exists();
    // choice A is marked as removed and is no longer checked.
    assert
      .dom(
        `.diff-version .diff-from-version [name="${this.field.pk}"][value="radio-a"]`,
      )
      .isNotChecked();
    assert
      .dom(`.diff-version [name="${this.field.pk}"][value="radio-b"]`)
      .isNotChecked();
    // choice C is marked as added and is checked.
    assert
      .dom(
        `.diff-version .diff-to-version [name="${this.field.pk}"][value="radio-c"]`,
      )
      .isChecked();
    assert
      .dom(`.diff-version [name="${this.field.pk}"][value="radio-d"]`)
      .isNotChecked();
  });

  test("cf-field renders a multiple choice widget compare diff", async function (assert) {
    this.field = this.findField("multiple-choice");

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"]`)
      .exists({ count: 4 });
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="checkbox-a"]`)
      .isChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="checkbox-b"]`)
      .isNotChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="checkbox-c"]`)
      .isChecked();
    assert
      .dom(`.uk-form-controls [name="${this.field.pk}"][value="checkbox-d"]`)
      .isNotChecked();
    assert.dom(`.combined-diff`).doesNotExist();

    // Render with diff when field is modified.
    this.set("field.answer.value", ["checkbox-a", "checkbox-d"]);
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`.combined-diff`).exists();
    // choice A remains checked so is not marked as changed.
    assert
      .dom(
        `.diff-version :not(.diff-from-version) [name="${this.field.pk}"][value="checkbox-a"]`,
      )
      .isChecked();
    assert
      .dom(`.diff-version [name="${this.field.pk}"][value="checkbox-b"]`)
      .isNotChecked();
    // choice C is no longer checked so is marked as removed.
    assert
      .dom(
        `.diff-version .diff-from-version [name="${this.field.pk}"][value="checkbox-c"]`,
      )
      .isNotChecked();
    // choice D is now checked so is marked as added.
    assert
      .dom(
        `.diff-version .diff-to-version [name="${this.field.pk}"][value="checkbox-d"]`,
      )
      .isChecked();
  });

  test("cf-field renders a table widget compare diff", async function (assert) {
    this.field = this.findField("table");
    const rowForm = {
      __typename: "Form",
      slug: "table-row-form",
      meta: {
        "is-top-form": false,
        level: 0,
      },
      questions: {
        edges: [
          {
            node: {
              slug: "table-question-1",
              label: "Table question 1",
              isRequired: "true",
              isHidden: "false",
              meta: {},
              __typename: "TextQuestion",
            },
          },
        ],
      },
    };
    this.set("field.question.raw.rowForm", rowForm);
    const tableValues = [
      {
        __typename: "Document",
        id: "document-table-row-history-1",
        documentId: "document-table-row-1",
        historyDate: "2024-01-01T12:00:00Z",
        historyUserId: "user-1",
        historyType: "=",
        form: rowForm,
        answers: {
          edges: [
            {
              node: {
                id: "table-row-1-answer-1",
                question: {
                  slug: "table-question-1",
                },
                historyDate: "2024-01-01T12:00:00Z",
                historyUserId: "user-1",
                historyType: "=",
                stringValue: "row 1 answer 1",
                __typename: "StringAnswer",
              },
            },
          ],
        },
      },
      {
        __typename: "Document",
        id: "document-table-row-history-2",
        documentId: "document-table-row-2",
        historyDate: "2024-01-01T12:00:00Z",
        historyUserId: "user-1",
        historyType: "=",
        form: rowForm,
        answers: {
          edges: [
            {
              node: {
                id: "table-row-2-answer-1",
                question: {
                  slug: "table-question-1",
                },
                historyDate: "2024-01-01T12:00:00Z",
                historyUserId: "user-1",
                historyType: "=",
                stringValue: "row 2 answer 1",
                __typename: "StringAnswer",
              },
            },
          ],
        },
      },
    ];
    this.set("field.answer.raw.tableValue", tableValues);
    this.set("field.answer.historical.tableValue", tableValues);

    // Normal render when field is not modified.
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`[data-question-slug="${this.field.question.slug}"]`).exists();
    assert
      .dom(`table tbody tr:nth-child(1) td:nth-child(1)`)
      .hasText("row 1 answer 1");
    assert
      .dom(`table tbody tr:nth-child(2) td:nth-child(1)`)
      .hasText("row 2 answer 1");

    assert.dom(`.cf-compare`).doesNotExist();

    // // Render with diff when table row is changed or removed.
    this.set("field.answer.value.0.raw.historyType", "~");
    this.set("field.answer.value.1.raw.historyType", "-");
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`.cf-compare`).exists();
    assert
      .dom(`.cf-compare .diff-version table tbody tr:nth-child(1)`)
      .hasClass("diff-modified");
    assert
      .dom(`.cf-compare .diff-version table tbody tr:nth-child(2)`)
      .hasClass("diff-removed");

    // // Render with diff when table row is added or equal.
    this.set("field.answer.value.0.raw.historyType", "+");
    this.set("field.answer.value.1.raw.historyType", "=");
    await render(
      hbs`<CfField @field={{this.field}} @compare={{this.compare}}/>`,
    );
    assert.dom(`.cf-compare`).exists();
    assert
      .dom(`.cf-compare .diff-version table tbody tr:nth-child(1)`)
      .hasClass("diff-added");
    assert
      .dom(`.cf-compare .diff-version table tbody tr:nth-child(2)`)
      .doesNotHaveClass("diff-removed")
      .doesNotHaveClass("diff-added")
      .doesNotHaveClass("diff-modified");
  });
});
