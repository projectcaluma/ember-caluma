import { visit, click, fillIn, currentURL } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupApplicationTest } from "dummy/tests/helpers";

module("Acceptance | form copy", function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  test("can copy a form", async function (assert) {
    assert.expect(5);

    const form = this.server.create("form");

    await visit("/");

    assert.dom("[data-test-copy-form-modal]").isNotVisible();

    await click(`[data-test-copy-form-button=${form.slug}]`);

    assert.dom("[data-test-copy-form-modal]").isVisible();

    assert.dom("[data-test-copy-modal-input-name]").hasValue(form.name);
    assert.dom("[data-test-copy-modal-input-slug]").hasValue(form.slug);

    await fillIn("[data-test-copy-modal-input-name]", `${form.name} copy`);
    await fillIn("[data-test-copy-modal-input-slug]", `${form.slug}-copy`);

    await click("[data-test-copy-form-submit]");

    assert.strictEqual(currentURL(), `/${form.slug}-copy`);
  });
});
