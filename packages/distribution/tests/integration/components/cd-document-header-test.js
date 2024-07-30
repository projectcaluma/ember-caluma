import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-document-header", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.status = "Test";

    await render(
      hbs`<CdDocumentHeader @name="Test" @status={{this.status}} />`,
      { owner: this.engine },
    );

    assert.dom("[data-test-document-header]").containsText("Test");
    assert.dom("[data-test-document-header] .uk-label").hasText("Test");

    this.set("status", null);

    assert.dom("[data-test-document-header] .uk-label").doesNotExist();
  });
});
