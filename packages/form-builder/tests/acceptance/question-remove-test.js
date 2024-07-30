import { visit, currentURL, click } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupApplicationTest } from "dummy/tests/helpers";

module("Acceptance | question remove", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can remove a question", async function (assert) {
    assert.expect(4);

    const { id } = this.server.create("form", { slug: "test-form" });
    this.server.create("question", { slug: "test-question", formIds: [id] });
    this.server.create("question", { slug: "test-question2", formIds: [id] });

    await visit("/test-form/questions/test-question");

    assert.dom("[data-test-question-list-item]").exists({ count: 2 });

    await click("[data-test-remove-question]");
    await click(`
      [data-test-question-list-item=test-question]
      [data-test-remove-item]
    `);
    await click(`
      [data-test-question-list-item=test-question2]
      [data-test-remove-item]
    `);

    assert.strictEqual(currentURL(), "/test-form");

    await click("[data-test-cancel]");

    assert.dom("[data-test-question-list-item=test-question]").doesNotExist();
    assert.dom("[data-test-question-list-item=test-question2]").doesNotExist();
  });
});
