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

    assert.dom("table > tbody > tr").exists({ count: 1 });

    await click("table > tbody > tr");

    assert.equal(currentURL(), "/test-form");

    await fillIn("input[name=name]", "Some Random Name");
    await fillIn("textarea[name=description]", "Some Random Description");

    await click("form button[type=submit]");

    assert.equal(currentURL(), "/test-form");
  });

  test("can delete a form", async function(assert) {
    assert.expect(5);

    this.server.create("form", { slug: "test-form" });

    await visit("/");

    assert.dom("table > tbody > tr").exists({ count: 1 });

    await click("table > tbody > tr:first-of-type");

    assert.equal(currentURL(), "/test-form");

    await click("form button[type=button]");

    assert.equal(currentURL(), "/");

    assert.dom("table > tbody > tr").exists({ count: 1 });
    assert.dom("table > tbody > tr > td").hasText("No forms found");
  });
});
