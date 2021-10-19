import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | form edit", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can edit a form", async function (assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 1 });

    await click("[data-test-form-list-item=test-form] [data-test-edit-form]");

    assert.strictEqual(currentURL(), "/test-form");

    await fillIn("input[name=name]", "Some Random Name");
    await fillIn("textarea[name=description]", "Some Random Description");

    await click("button[type=submit]");

    assert.strictEqual(currentURL(), "/test-form");
  });
});
