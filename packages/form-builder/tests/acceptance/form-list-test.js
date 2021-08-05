import { visit, typeIn, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test, skip } from "qunit";

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
    assert.expect(3);

    this.server.createList("form", 5);
    this.server.create("form", { name: "Test", slug: "test" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 6 });

    await typeIn("[data-test-form-search-input]", "test");

    assert.dom("[data-test-form-list-item]").exists({ count: 1 });

    await fillIn("[data-test-form-search-input]", "");

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

    await typeIn("[data-test-form-search-input]", "form");

    assert.dom("[data-test-form-list-item]").exists({ count: 20 });

    await click("[data-test-form-loader-button]");

    assert.dom("[data-test-form-list-item]").exists({ count: 25 });

    assert.dom("[data-test-form-loader-button]").doesNotExist();
  });

  skip("can search substrings", async function (assert) {
    assert.expect(3);

    this.server.createList("form", 3);
    this.server.create("form", { name: "Fo 1", slug: "fo-1" });
    this.server.create("form", { name: "Fo 2", slug: "fo-2" });
    this.server.create("form", { name: "Test", slug: "test" });

    await visit("/");

    assert.dom("[data-test-form-list-item]").exists({ count: 6 });

    await typeIn("[data-test-form-search-input]", "fo");

    assert.dom("[data-test-form-list-item]").exists({ count: 5 });

    await typeIn("[data-test-form-search-input]", "rm");

    assert.dom("[data-test-form-list-item]").exists({ count: 3 });
  });
});
