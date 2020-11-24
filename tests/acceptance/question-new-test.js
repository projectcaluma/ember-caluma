import { visit, currentURL, click, fillIn } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupApplicationTest } from "ember-qunit";
import { module, test } from "qunit";

module("Acceptance | question new", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can create a question", async function (assert) {
    assert.expect(4);

    this.server.create("form", { slug: "test-form" });

    await visit("/demo/form-builder/test-form");

    assert
      .dom("[data-test-demo-content] [data-test-question-list-item]")
      .doesNotExist();

    await click("[data-test-demo-content] [data-test-add-question]");
    await click("[data-test-demo-content] [data-test-new-question]");

    assert.equal(currentURL(), "/demo/form-builder/test-form/questions/new");

    await fillIn("[data-test-demo-content] [name=label]", "Test Question 1?");
    await fillIn("[data-test-demo-content] [name=slug]", "testy-test-test");
    await fillIn(
      "[data-test-demo-content] [name=__typename]",
      "IntegerQuestion"
    );

    await click("[data-test-demo-content] button[type=submit]");

    assert.equal(
      currentURL(),
      "/demo/form-builder/test-form/questions/testy-test-test"
    );

    assert
      .dom(
        "[data-test-demo-content] [data-test-question-list-item=testy-test-test]"
      )
      .exists();
  });
});
