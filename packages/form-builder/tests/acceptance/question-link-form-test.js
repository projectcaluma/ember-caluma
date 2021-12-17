import { visit, click, currentURL } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | question link form", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can link to subforms", async function (assert) {
    assert.expect(10);

    const questions = this.server.createList("question", 3);
    const subForm = this.server.create("form", { questions });
    const question = this.server.create("question", {
      type: "FORM",
      subForm,
    });
    const form = this.server.create("form", { questions: [] });

    await visit(`/${form.slug}`);
    await click("[data-test-add-question]");
    assert
      .dom(
        `[data-test-question-list-item=${question.slug}] [data-test-link-subform]`
      )
      .doesNotExist();
    await click(
      `[data-test-question-list-item=${question.slug}] [data-test-add-item]`
    );

    await click("[data-test-cancel]");

    await click(
      `[data-test-question-list-item=${question.slug}] [data-test-link-subform]`
    );
    assert.strictEqual(currentURL(), `/${subForm.slug}`);

    assert
      .dom("[data-test-question-list-item]")
      .exists({ count: questions.length });
    const questionList = [
      ...document.querySelectorAll("[data-test-question-list-item]"),
    ];
    questions.forEach((question, index) => {
      assert.dom(questionList[index]).containsText(question.slug);
    });

    assert.strictEqual(
      document.querySelector("input[name='name']").value,
      subForm.name
    );
    assert
      .dom(".uk-breadcrumb .cfb-navigation__item__link")
      .exists({ count: 2 });
    assert
      .dom(".uk-breadcrumb :nth-child(2) .cfb-navigation__item__link")
      .hasAttribute("href", `/${subForm.slug}`);
    assert
      .dom(".uk-breadcrumb :nth-child(2) .cfb-navigation__item__link")
      .hasText(subForm.name);
  });

  test("can link to rowforms", async function (assert) {
    assert.expect(8);

    this.server.create("document");
    const rowFormQuestion = this.server.create("question", { type: "TABLE" });
    const rowForm = this.server.create("form", {
      questions: [rowFormQuestion],
    });
    const question = this.server.create("question", {
      type: "TABLE",
      rowForm,
    });
    const form = this.server.create("form", { questions: [question] });

    await visit(`/${form.slug}`);
    await click("[data-test-add-question]");
    assert
      .dom(
        `[data-test-question-list-item=${rowFormQuestion.slug}] [data-test-link-subform]`
      )
      .doesNotExist();

    await click("[data-test-cancel]");
    await click(
      `[data-test-question-list-item=${question.slug}] [data-test-link-subform]`
    );
    assert.strictEqual(currentURL(), `/${rowForm.slug}`);

    assert.dom("[data-test-question-list-item]").exists({ count: 1 });
    assert
      .dom("[data-test-question-list-item]")
      .containsText(rowFormQuestion.slug);
    assert.strictEqual(
      document.querySelector("input[name='name']").value,
      rowForm.name
    );

    assert
      .dom(".uk-breadcrumb .cfb-navigation__item__link")
      .exists({ count: 2 });
    assert
      .dom(".uk-breadcrumb :nth-child(2) .cfb-navigation__item__link")
      .hasAttribute("href", `/${rowForm.slug}`);
    assert
      .dom(".uk-breadcrumb :nth-child(2) .cfb-navigation__item__link")
      .hasText(rowForm.name);
  });
});
