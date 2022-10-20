import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-document-header", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.status = "Test";

    await render(hbs`
      <CdDocumentHeader
        @name="Test"
        @status={{this.status}}
      />
    `);

    assert.dom("p.uk-text-large").containsText("Test");
    assert.dom("p.uk-text-large .uk-label").hasText("Test");

    this.set("status", null);

    assert.dom("p.uk-text-large .uk-label").doesNotExist();
  });
});
