import { module, test } from "qunit";
import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import { setupMirage } from "ember-cli-mirage/test-support";

module("Acceptance | form new", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can create a form", async function (assert) {
    assert.expect(3);

    this.server.createList("form", 2);

    await visit("/demo/form-builder/");

    assert
      .dom("[data-test-demo-content] [data-test-form-list-item]")
      .exists({ count: 2 });

    await click("[data-test-demo-content] [data-test-new-form]");

    assert.equal(currentURL(), "/demo/form-builder/new");

    await fillIn(
      "[data-test-demo-content] input[name=name]",
      "Some Random Name"
    );
    await fillIn(
      "[data-test-demo-content] input[name=slug]",
      "testy-test-test"
    );
    await fillIn(
      "[data-test-demo-content] textarea[name=description]",
      "Some Random Description"
    );

    await click("[data-test-demo-content] button[type=submit]");

    assert.equal(currentURL(), "/demo/form-builder/testy-test-test");
  });
});
