import { visit, currentURL, click, fillIn, settled } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupApplicationTest } from "dummy/tests/helpers";

module("Acceptance | question add", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can add an existing question", async function (assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });
    this.server.create("question", { slug: "test-question" });

    await visit("/test-form");

    assert.dom("[data-test-question-list-item]").doesNotExist();

    await click("[data-test-add-question]");
    await fillIn("input[type=search]", "test");
    await click(`
      [data-test-question-list-item=test-question]
      [data-test-add-item]
    `);

    assert.strictEqual(currentURL(), "/test-form/questions/test-question");

    await click("[data-test-cancel]");
    // eslint-disable-next-line ember/no-settled-after-test-helper
    await settled();

    assert.dom("[data-test-question-list-item=test-question]").exists();
  });
});
