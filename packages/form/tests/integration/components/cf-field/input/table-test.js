import { waitFor, click, fillIn, render, scrollTo } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import UIkit from "uikit";

import { parseDocument } from "@projectcaluma/ember-form/lib/parsers";

module("Integration | Component | cf-field/input/table", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.field = {
      pk: "table-test",
      answer: {
        value: [
          {
            fields: [
              {
                question: { __typename: "TextQuestion", slug: "first-name" },
                answer: { value: "Max" },
              },
              {
                question: { __typename: "TextQuestion", slug: "last-name" },
                answer: { value: "Muster" },
              },
            ],
          },
          {
            fields: [
              {
                question: { __typename: "TextQuestion", slug: "first-name" },
                answer: { value: "Bea" },
              },
              {
                question: { __typename: "TextQuestion", slug: "last-name" },
                answer: { value: "Beispiel" },
              },
            ],
          },
        ],
      },
      question: {
        meta: {},
        rowForm: {
          questions: {
            edges: [
              { node: { slug: "first-name", label: "First name" } },
              { node: { slug: "last-name", label: "Last name" } },
            ],
          },
        },
      },
    };
  });

  test("it renders as table", async function (assert) {
    await render(hbs`<CfField::Input::Table @field={{this.field}} />`);

    assert.dom("th:nth-of-type(1)").hasText("First name");
    assert.dom("th:nth-of-type(2)").hasText("Last name");

    assert.dom("tbody > tr:first-of-type > td:nth-of-type(1)").hasText("Max");
    assert
      .dom("tbody > tr:first-of-type > td:nth-of-type(2)")
      .hasText("Muster");

    assert.dom("tbody > tr").exists({ count: 2 });
  });

  test("it displays only configured columns", async function (assert) {
    this.field.question.meta.columnsToDisplay = ["last-name"];

    await render(hbs`<CfField::Input::Table @field={{this.field}} />`);

    assert.dom("th:nth-of-type(1)").hasText("Last name");
    assert
      .dom("tbody > tr:first-of-type > td:nth-of-type(1)")
      .hasText("Muster");

    assert.dom("th").exists({ count: 2 });
    assert.dom("tbody > tr:first-of-type > td").exists({ count: 2 });
  });

  test("it displays an error indicator for invalid rows", async function (assert) {
    this.field.answer.value[0].fields[0].isValid = false;

    await render(hbs`<CfField::Input::Table @field={{this.field}} />`);

    assert
      .dom(
        "tbody > tr:nth-of-type(1) > td:last-of-type [icon=warning].uk-text-danger"
      )
      .exists();
    assert
      .dom(
        "tbody > tr:nth-of-type(2) > td:last-of-type [icon=warning].uk-text-danger"
      )
      .doesNotExist();
  });

  test("it renders disabled", async function (assert) {
    await render(
      hbs`<CfField::Input::Table @field={{this.field}} @disabled={{true}} />`
    );

    assert.dom("[data-test-add-row]").doesNotExist();
    assert.dom("[data-test-edit-row]").exists();
    assert.dom("[data-test-delete-row]").doesNotExist();
  });

  module("actions", function (hooks) {
    setupMirage(hooks);

    hooks.beforeEach(function () {
      this.rootForm = this.server.create("form");
      this.tableForm = this.server.create("form");

      this.tableQuestion = this.server.create("question", {
        slug: "table",
        type: "TABLE",
        rowFormId: this.tableForm.id,
        formIds: [this.rootForm.id],
      });
      this.rowQuestion = this.server.create("question", {
        slug: "first-name",
        type: "TEXT",
        minLength: 1,
        maxLength: 10,
        formIds: [this.tableForm.id],
      });

      (this.rowAnswer = this.server.create("answer", {
        value: "Foo",
        questionId: this.rowQuestion.id,
      }).id),
        (this.rowDocument = this.server.create("document", {
          formId: this.tableForm.id,
          answerIds: [],
        }));
      this.document = this.server.create("document", {
        formId: this.rootForm.id,
      });

      this.tableAnswer = this.server.create("answer", {
        documentId: this.document.id,
        questionId: this.tableQuestion.id,
      });

      const data = {
        id: btoa(`Document:${this.document.id}`),
        answers: {
          edges: [
            {
              node: {
                id: btoa(`Answer:${this.tableAnswer.id}`),
                question: {
                  slug: this.tableQuestion.slug,
                },
                tableValue: [
                  {
                    id: btoa(`Document:${this.rowDocument.id}`),
                    form: {
                      slug: this.tableForm.slug,
                      meta: {},
                      questions: {
                        edges: [
                          {
                            node: {
                              slug: this.rowQuestion.slug,
                              label: this.rowQuestion.label,
                              isRequired: "true",
                              isHidden: "false",
                              meta: {},
                              __typename: "TextQuestion",
                            },
                          },
                        ],
                      },
                      __typename: "Form",
                    },
                    answers: {
                      edges: [
                        {
                          node: {
                            id: btoa(`StringAnswer:${this.rowAnswer.id}`),
                            question: {
                              slug: this.rowQuestion.slug,
                            },
                            stringValue: this.rowAnswer.value,
                            __typename: "StringAnswer",
                          },
                        },
                      ],
                    },
                    __typename: "Document",
                  },
                ],
                __typename: "TableAnswer",
              },
            },
          ],
        },
        form: {
          slug: "form",
          meta: {
            "is-top-form": true,
            level: 0,
          },
          questions: {
            edges: [
              {
                node: {
                  slug: this.tableQuestion.slug,
                  label: this.tableQuestion.label,
                  isRequired: "true",
                  isHidden: "false",
                  meta: {},
                  rowForm: {
                    slug: this.tableForm.slug,
                    questions: {
                      edges: [
                        {
                          node: {
                            slug: this.rowQuestion.slug,
                            label: this.rowQuestion.label,
                            isRequired: "true",
                            isHidden: "false",
                            meta: {},
                            __typename: "TextQuestion",
                          },
                        },
                      ],
                    },
                    __typename: "Form",
                  },
                  __typename: "TableQuestion",
                },
              },
            ],
          },
          __typename: "Form",
        },
        __typename: "Document",
      };

      this.calumaDocument = this.owner
        .factoryFor("caluma-model:document")
        .create({ raw: parseDocument(data) });

      this.field = this.calumaDocument.fields[0];

      UIkit.container = this.owner.rootElement;
    });

    test("it can add a row", async function (assert) {
      assert.expect(5);

      this.save = (value) => {
        assert.strictEqual(value.length, 2);
        assert.step("save");
      };

      await render(hbs`
        <CfField::Input::Table
          @field={{this.field}}
          @onSave={{this.save}}
        />
      `);

      await click("[data-test-add-row]");

      const input = `input[name$=":Question:${this.rowQuestion.slug}"]`;
      await waitFor(input);

      await click("[data-test-save]");
      assert.dom("[data-test-save]").isDisabled();
      await fillIn(input, "Test");
      await scrollTo("[data-test-save]", 0, 0);
      await waitFor("[data-test-save]:enabled");
      assert.dom("[data-test-save]").isEnabled();

      await click("[data-test-save]");

      assert.verifySteps(["save"]);
    });

    test("it can edit a row", async function (assert) {
      assert.expect(1);

      await render(hbs`
        <CfField::Input::Table
          @field={{this.field}}
        />
      `);

      await click("[data-test-edit-row]");

      const input = `input[name$=":Question:${this.rowQuestion.slug}"]`;
      await waitFor(input);

      await fillIn(input, "Test");
      await scrollTo("[data-test-save]", 0, 0);
      await waitFor("[data-test-save]:enabled");
      await click("[data-test-save]");

      assert
        .dom("tbody > tr:first-of-type > td:nth-of-type(1)")
        .hasText("Test");
    });

    test("it can delete a row", async function (assert) {
      assert.expect(3);

      this.save = (value) => {
        assert.strictEqual(value.length, 0);
        assert.step("save");
      };

      await render(hbs`
        <CfField::Input::Table
          @field={{this.field}}
          @onSave={{this.save}}
        />
      `);

      await click("[data-test-delete-row]");
      await click("button[autofocus]");

      assert.verifySteps(["save"]);
    });
  });
});
