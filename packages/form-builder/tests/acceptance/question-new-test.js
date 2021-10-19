import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | question new", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can create a question", async function (assert) {
    assert.expect(4);

    this.server.create("form", { slug: "test-form" });

    await visit("/test-form");

    assert.dom("[data-test-question-list-item]").doesNotExist();

    await click("[data-test-add-question]");
    await click("[data-test-new-question]");

    assert.strictEqual(currentURL(), "/test-form/questions/new");

    await fillIn("[name=label]", "Test Question 1?");
    await fillIn("[name=slug]", "testy-test-test");
    await fillIn("[name=__typename]", "IntegerQuestion");

    await click("button[type=submit]");

    assert.strictEqual(currentURL(), "/test-form/questions/testy-test-test");

    assert.dom("[data-test-question-list-item=testy-test-test]").exists();
  });
});
