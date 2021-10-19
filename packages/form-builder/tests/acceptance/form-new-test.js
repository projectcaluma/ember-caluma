import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | form new", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can create a form", async function (assert) {
    assert.expect(3);

    this.server.createList("form", 2);

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 2 });

    await click("[data-test-new-form]");

    assert.strictEqual(currentURL(), "/new");

    await fillIn("input[name=name]", "Some Random Name");
    await fillIn("input[name=slug]", "testy-test-test");
    await fillIn("textarea[name=description]", "Some Random Description");

    await click("button[type=submit]");

    assert.strictEqual(currentURL(), "/testy-test-test");
  });
});
