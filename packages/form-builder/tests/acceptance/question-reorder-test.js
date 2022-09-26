import { visit, triggerEvent, find } from "@ember/test-helpers";
import { setupApplicationTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Acceptance | question reorder", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can reorder questions", async function (assert) {
    assert.expect(2);

    const questions = this.server.createList("question", 4);
    const question = this.server.create("question", { slug: "test" });

    this.server.create("form", {
      slug: "test-form",
      questions: [...questions, question],
    });

    await visit("/test-form");

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
});
