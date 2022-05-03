import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cd-document-header", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.isDraft = true;
    this.modifiedAt = new Date(2022, 4, 3, 14, 43);
    this.modifiedBy = 1;

    await render(hbs`
      <CdDocumentHeader
        @name="Test"
        @isDraft={{this.isDraft}}
        @modifiedAt={{this.modifiedAt}}
        @modifiedBy={{this.modifiedBy}}
      />
    `);

    assert.dom("p.uk-text-large").containsText("Test");
    assert
      .dom("p.uk-text-large .uk-label")
      .hasText("t:caluma.distribution.status.draft:()");

    assert
      .dom("p.uk-text-meta")
      .hasText(
        't:caluma.distribution.last-modified:("date":"5/3/2022","time":"02:43 PM","user":1)'
      );

    this.set("isDraft", false);

    assert.dom("p.uk-text-large .uk-label").doesNotExist();

    this.set("modifiedBy", null);

    assert.dom("p.uk-text-meta").doesNotExist();
  });
});
