import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | inquiry-dialog/inquiry", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    this.inquiry = inquiry();

    await render(hbs`<InquiryDialog::Inquiry @inquiry={{this.inquiry}} />`);

    assert.dom(".uk-position-top-right").exists();
    assert.dom(".inquiry-divider").exists();
    assert.dom(".uk-subnav").exists({ count: 2 });
    assert.dom("p").exists({ count: 4 });
  });
});
