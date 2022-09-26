import { render } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

module("Integration | Component | ca-filter-modal", function (hooks) {
  setupRenderingTest(hooks);

  test.skip("it renders", async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<CaFilterModal />`);

    assert.dom(this.element).hasText("");

    // Template block usage:
    await render(hbs`
      <CaFilterModal>
        template block text
      </CaFilterModal>
    `);

    assert.dom(this.element).hasText("template block text");
  });
});
