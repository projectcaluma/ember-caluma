import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, skip } from "qunit";

module("Integration | Component | cf-navigation-item", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  skip("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CfNavigationItem />`);

    assert.dom(this.element).hasText("");
  });
});
