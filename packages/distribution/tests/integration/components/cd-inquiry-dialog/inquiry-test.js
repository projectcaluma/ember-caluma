import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

module("Integration | Component | cd-inquiry-dialog/inquiry", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.inquiry = inquiry();

    await render(hbs`<CdInquiryDialog::Inquiry @inquiry={{this.inquiry}} />`);

    assert.dom("[data-test-deadline]").exists();
    assert.dom(".inquiry-divider").exists();
    assert.dom(".uk-subnav").exists({ count: 2 });
    assert.dom("[data-test-title]").exists({ count: 2 });
    assert.dom("p").exists({ count: 3 });
  });
});
