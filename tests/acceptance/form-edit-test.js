import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | form edit", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can edit a form", async function(assert) {
    assert.expect(3);

    this.server.create("form", { slug: "test-form" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 1 });

    await click("[data-test-form-list-item=test-form] [data-test-edit-form]");

    assert.equal(currentURL(), "/test-form");

    await fillIn("input[name=name]", "Some Random Name");
    await fillIn("textarea[name=description]", "Some Random Description");

    await click("[data-test-submit]");

    assert.equal(currentURL(), "/test-form");
  });

  test("can delete a form", async function(assert) {
    assert.expect(4);

    this.server.create("form", { slug: "test-form" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 1 });

    await click("[data-test-form-list-item=test-form] [data-test-edit-form]");

    assert.equal(currentURL(), "/test-form");

    await click("[data-test-delete]");

    assert.equal(currentURL(), "/");

    assert.dom("[data-test-form-list-item=test-form]").doesNotExist();
  });
});
