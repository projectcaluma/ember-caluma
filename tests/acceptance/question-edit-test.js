import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | question edit", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can edit question", async function(assert) {
    assert.expect(3);

    const { id } = this.server.create("form", { slug: "test-form" });
    this.server.create("question", {
      label: "Test Question?",
      slug: "test-question",
      type: "TEXT",
      formIds: [id]
    });

    await visit("/demo/form-builder/test-form");

    assert
      .dom("[data-test-demo-content] [data-test-question-list-item]")
      .exists({ count: 1 });

    await click(
      "[data-test-demo-content] [data-test-question-list-item=test-question] [data-test-edit-question]"
    );

    assert.equal(
      currentURL(),
      "/demo/form-builder/test-form/questions/test-question"
    );

    await fillIn("[data-test-demo-content] [name=label]", "Test Question 1?");

    await click("[data-test-demo-content] button[type=submit]");

    assert.equal(currentURL(), "/demo/form-builder/test-form");
  });
});
