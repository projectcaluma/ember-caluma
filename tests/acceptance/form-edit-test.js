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

    await visit("/demo/form-builder");

    assert
      .dom("[data-test-demo-content] [data-test-form-list-item]")
      .exists({ count: 1 });

    await click(
      "[data-test-demo-content] [data-test-form-list-item=test-form] [data-test-edit-form]"
    );

    assert.equal(currentURL(), "/demo/form-builder/test-form");

    await fillIn(
      "[data-test-demo-content] input[name=name]",
      "Some Random Name"
    );
    await fillIn(
      "[data-test-demo-content] textarea[name=description]",
      "Some Random Description"
    );

    await click("[data-test-demo-content] button[type=submit]");

    assert.equal(currentURL(), "/demo/form-builder/test-form");
  });

  test("can archive a form", async function(assert) {
    assert.expect(4);

    this.server.create("form", { slug: "test-form" });

    await visit("/demo/form-builder");

    assert
      .dom("[data-test-demo-content] [data-test-form-list-item]")
      .exists({ count: 1 });

    await click(
      "[data-test-demo-content] [data-test-form-list-item=test-form] [data-test-edit-form]"
    );

    assert.equal(currentURL(), "/demo/form-builder/test-form");

    await click("[data-test-demo-content] [data-test-archive]");

    assert.equal(currentURL(), "/demo/form-builder");

    assert
      .dom("[data-test-demo-content] [data-test-form-list-item=test-form]")
      .doesNotExist();
  });

  test("can go back to list", async function(assert) {
    assert.expect(1);

    this.server.create("form", { slug: "test-form" });

    await visit("/demo/form-builder/test-form");

    await click("[data-test-back]");

    assert.equal(currentURL(), "/demo/form-builder");
  });
});
