import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, skip } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-form-wrapper", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  skip("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CfFormWrapper />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`<CfFormWrapper>
  template block text
</CfFormWrapper>`);

    assert.dom(this.element).hasText("template block text");
  });
});
