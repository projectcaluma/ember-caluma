import { module, test } from "qunit";
import { visit } from "@ember/test-helpers";
import { setupApplicationTest } from "ember-qunit";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Acceptance | form list", function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test("can list forms", async function(assert) {
    assert.expect(1);

    this.server.createList("form", 5);

    await visit("/demo/form-builder");

    assert
      .dom("[data-test-demo-content] [data-test-form-list-item]")
      .exists({ count: 5 });
  });
});
