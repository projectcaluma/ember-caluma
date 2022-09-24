import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | cfb-navigation", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfbNavigation />`);

    assert.dom("ul.uk-breadcrumb").exists();
  });
});
