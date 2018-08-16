import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | form edit", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can create a form", async function(assert) {
    assert.expect(3);

    this.server.createList("form", 2);

    await visit("/");

    assert.dom("table > tbody > tr").exists({ count: 2 });

    await click("h1 button");

    assert.equal(currentURL(), "/new");

    await fillIn("input[name=name]", "Some Random Name");
    await fillIn("input[name=slug]", "testy-test-test");
    await fillIn("textarea[name=description]", "Some Random Description");

    await click("form button[type=submit]");

    assert.equal(currentURL(), "/testy-test-test");
  });
});
