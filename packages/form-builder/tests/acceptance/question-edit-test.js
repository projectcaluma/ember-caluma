import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | question edit", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can edit question", async function (assert) {
    assert.expect(3);

    const { id } = this.server.create("form", { slug: "test-form" });
    this.server.create("question", {
      label: "Test Question?",
      slug: "test-question",
      type: "TEXT",
      formIds: [id],
    });

    await visit("/test-form");

    assert.dom("[data-test-question-list-item]").exists({ count: 1 });

    await click(
      "[data-test-question-list-item=test-question] [data-test-edit-question]"
    );

    assert.strictEqual(currentURL(), "/test-form/questions/test-question");

    await fillIn("[name=label]", "Test Question 1?");

    await click("button[type=submit]");

    assert.strictEqual(currentURL(), "/test-form");
  });
});
