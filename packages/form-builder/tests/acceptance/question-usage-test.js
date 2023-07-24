import { visit, click } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupApplicationTest } from "dummy/tests/helpers";

module("Acceptance | question usage", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can show the question usage", async function (assert) {
    assert.expect(4);

    const firstForm = this.server.create("form", { slug: "test-form" });
    const secondForm = this.server.create("form", {
      slug: "second-form",
      isArchived: true,
      isPublished: false,
    });

    this.server.create("question", {
      label: "Test Question?",
      slug: "test-question",
      type: "TEXT",
      formIds: [firstForm.id, secondForm.id],
    });

    await visit("/test-form/questions/test-question");

    await click("[data-test-show-question-usage-modal-btn]");

    assert.dom("[data-test-question-usage-modal]").isVisible();

    assert.dom("[data-test-question-form-item='test-form']").exists();

    assert
      .dom("[data-test-question-form-item='second-form']")
      .containsText("Archived", "archived status is visible");

    assert
      .dom("[data-test-question-form-item='second-form']")
      .containsText("not published", "not published status is visible");
  });
});
