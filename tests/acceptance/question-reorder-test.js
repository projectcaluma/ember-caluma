import { module, test } from "qunit";
import { visit, triggerEvent, find } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | question reorder", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can reorder questions", async function(assert) {
    assert.expect(2);

    const questions = this.server.createList("question", 4);
    const question = this.server.create("question", { slug: "test" });

    this.server.create("form", {
      slug: "test-form",
      questions: [...questions, question]
    });

    await visit("/demo/form-builder/test-form");

    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=test]:last-child"
      )
      .exists();

    let list = await find("[data-test-demo-content] [data-test-question-list]");
    let item = await find(
      "[data-test-demo-content] [data-test-question-list-item=test]"
    );

    // create a new array of children in which the chosen item is first instead of last
    let children = [
      item,
      ...[...list.children].filter(
        c => c.dataset.testQuestionListItem !== "test"
      )
    ];

    await triggerEvent(list, "moved", {
      detail: [
        {
          $el: {
            children
          }
        }
      ]
    });

    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=test]:first-child"
      )
      .exists();
  });
});
