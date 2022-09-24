import { visit, click, fillIn, currentURL } from "@ember/test-helpers";
import { setupApplicationTest } from "dummy/tests/helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Acceptance | form list", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can list forms", async function (assert) {
    assert.expect(1);

    this.server.createList("form", 5);

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 5 });
  });

  test("can search forms", async function (assert) {
    assert.expect(5);

    this.server.createList("form", 5);
    this.server.create("form", { name: "Test", slug: "test" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 6 });

    await fillIn("[data-test-form-search-input]", "test");

    assert.strictEqual(currentURL(), "/?search=test");
    assert.dom("[data-test-form-list-item]").exists({ count: 1 });

    await fillIn("[data-test-form-search-input]", "");

    assert.strictEqual(currentURL(), "/");
    assert.dom("[data-test-form-list-item]").exists({ count: 6 });
  });

  test("can paginate forms", async function (assert) {
    assert.expect(3);

    this.server.createList("form", 25);

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 20 });

    await click("[data-test-form-loader-button]");

    assert.dom("[data-test-form-list-item]").exists({ count: 25 });

    assert.dom("[data-test-form-loader-button]").doesNotExist();
  });

  test("can combine search and pagination", async function (assert) {
    assert.expect(4);

    this.server.createList("form", 25);
    this.server.create("form", { name: "Test 1", slug: "test-1" });
    this.server.create("form", { name: "Test 2", slug: "test-2" });
    this.server.create("form", { name: "Test 3", slug: "test-3" });
    this.server.create("form", { name: "Test 4", slug: "test-4" });
    this.server.create("form", { name: "Test 5", slug: "test-5" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 20 });

    await fillIn("[data-test-form-search-input]", "form");

    assert.dom("[data-test-form-list-item]").exists({ count: 20 });

    await click("[data-test-form-loader-button]");

    assert.dom("[data-test-form-list-item]").exists({ count: 25 });

    assert.dom("[data-test-form-loader-button]").doesNotExist();
  });
});
