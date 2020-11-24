import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, skip } from "qunit";

module("Integration | Component | cf-pagination", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  skip("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CfPagination />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <CfPagination>
        template block text
      </CfPagination>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
