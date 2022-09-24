import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | ca-field-selector-list", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test.skip("it renders", async function (assert) {
    await render(hbs`<CaFieldSelectorList />`);

    assert.dom(this.element).hasText("");
  });
});
