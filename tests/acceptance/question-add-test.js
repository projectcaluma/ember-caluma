import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | question add", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can add an existing question", async function(assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });
    this.server.create("question", { slug: "test-question" });

    await visit("/demo/form-builder/test-form");

    assert
      .dom("[data-test-demo-content] [data-test-question-list-item]")
      .doesNotExist();

    await click("[data-test-demo-content] [data-test-add-question]");
    await fillIn("[data-test-demo-content] input[type=search]", "test");
    await click(`
      [data-test-demo-content]
      [data-test-question-list-item=test-question]
      [data-test-add-item]
    `);

    assert.equal(
      currentURL(),
      "/demo/form-builder/test-form/questions/test-question"
    );

    await click("[data-test-demo-content] [data-test-cancel]");

    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=test-question]"
      )
      .exists();
  });
});
