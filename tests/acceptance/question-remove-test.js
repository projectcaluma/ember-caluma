import { module, test } from "qunit";
import { visit, currentURL, click } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | question remove", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can remove a question", async function(assert) {
    assert.expect(4);

    const { id } = this.server.create("form", { slug: "test-form" });
    this.server.create("question", { slug: "test-question", formIds: [id] });
    this.server.create("question", { slug: "test-question2", formIds: [id] });

    await visit("/demo/form-builder/test-form/questions/test-question");

    assert
      .dom("[data-test-demo-content] [data-test-question-list-item]")
      .exists({ count: 2 });

    await click("[data-test-demo-content] [data-test-remove-question]");
    await click(`
      [data-test-demo-content]
      [data-test-question-list-item=test-question]
      [data-test-remove-item]
    `);
    await click(`
      [data-test-demo-content]
      [data-test-question-list-item=test-question2]
      [data-test-remove-item]
    `);

    assert.equal(currentURL(), "/demo/form-builder/test-form");

    await click("[data-test-demo-content] [data-test-cancel]");

    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=test-question]"
      )
      .doesNotExist();
    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=test-question2]"
      )
      .doesNotExist();
  });
});
