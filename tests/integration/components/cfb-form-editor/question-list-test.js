import { render, click, find, fillIn, triggerEvent } from "@ember/test-helpers";
import graphqlError from "dummy/tests/helpers/graphql-error";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | cfb-form-editor/question-list",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      this.form = this.server.create("form", {
        name: "Test Name",
        slug: "test-slug",
        questions: this.server.createList("question", 5),
      });
    });

    test("it renders", async function (assert) {
      assert.expect(1);

      await render(hbs`<CfbFormEditor::QuestionList @form='test-slug'/>`);

      assert.dom("[data-test-question-list-item]").exists({ count: 5 });
    });

    test("it renders an empty state", async function (assert) {
      assert.expect(4);

      this.server.create("form", { slug: "oioi" });

      this.set("mode", "reorder");

      await render(
        hbs`<CfbFormEditor::QuestionList @form='oioi' @mode={{this.mode}}/>`
      );

      assert.dom("[data-test-question-list-empty]").exists();
      assert
        .dom("[data-test-question-list-empty]")
        .hasText("t:caluma.form-builder.question.empty:()");

      await click("[data-test-add-question]");
      await fillIn("input[type=search]", "thisslugisveryunlikelytoexist");
      assert
        .dom("[data-test-question-list-empty]")
        .hasText("t:caluma.form-builder.global.empty-search:()");

      this.set("mode", "remove");
      await fillIn("input[type=search]", "thisslugisveryunlikelytoexist");
      assert
        .dom("[data-test-question-list-empty]")
        .hasText("t:caluma.form-builder.global.empty-search:()");
    });

    test("it can reorder questions", async function (assert) {
      assert.expect(2);

      const question = this.server.create("question", {
        slug: "test",
        formIds: [this.form.id],
      });

      this.form.questionIds = [...this.form.questionIds, question.id];

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='reorder'/>`
      );

      assert.dom("[data-test-question-list-item=test]:last-child").exists();

      const list = await find("[data-test-question-list]");
      const item = await find("[data-test-question-list-item=test]");

      // create a new array of children in which the chosen item is first instead of last
      const children = [
        item,
        ...[...list.children].filter(
          (c) => c.dataset.testQuestionListItem !== "test"
        ),
      ];

      await triggerEvent(list, "moved", {
        detail: [
          {
            $el: {
              children,
            },
          },
        ],
      });

      assert.dom("[data-test-question-list-item=test]:first-child").exists();
    });

    test("it can add questions", async function (assert) {
      assert.expect(3);

      this.server.create("question", { slug: "test" });

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='add'/>`
      );

      assert.dom("[data-test-question-list-item=test]").exists();
      await click("[data-test-question-list-item=test] [data-test-add-item]");
      assert.dom("[data-test-question-list-item=test]").doesNotExist();
      await click("[data-test-cancel]");
      assert.dom("[data-test-question-list-item=test]").exists();
    });

    test("it can remove questions", async function (assert) {
      assert.expect(3);

      this.server.create("question", { slug: "test", formIds: [this.form.id] });

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='remove'/>`
      );

      assert.dom("[data-test-question-list-item=test]").exists();
      await click(
        "[data-test-question-list-item=test] [data-test-remove-item]"
      );
      assert.dom("[data-test-question-list-item=test]").doesNotExist();
      await click("[data-test-cancel]");
      assert.dom("[data-test-question-list-item=test]").doesNotExist();
    });

    test("it can handle reorder errors", async function (assert) {
      assert.expect(1);

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='reorder'/>`
      );

      this.server.post(
        "/graphql",
        () => graphqlError("reorderFormQuestions"),
        200
      );
      await triggerEvent("[data-test-question-list]", "moved", {
        detail: [
          {
            $el: {
              children: [],
            },
          },
        ],
      });

      assert.ok(true);
    });

    test("it can handle remove errors", async function (assert) {
      assert.expect(1);

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='remove'/>`
      );

      this.server.post(
        "/graphql",
        () => graphqlError("removeFormQuestion"),
        200
      );
      await click("[data-test-remove-item]");

      assert.ok(true);
    });

    test("it can handle add errors", async function (assert) {
      assert.expect(1);

      this.server.create("question");

      await render(
        hbs`<CfbFormEditor::QuestionList @form='test-slug' @mode='add'/>`
      );

      this.server.post("/graphql", () => graphqlError("addFormQuestion"), 200);
      await click("[data-test-add-item]");

      assert.ok(true);
    });
  }
);
