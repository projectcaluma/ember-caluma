import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-form-list/head", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{#cfb-form-list/head}}
        <tr>
          <th>Header</th>
        </tr>
      {{/cfb-form-list/head}}
    `);

    assert.dom("thead").exists();
    assert.dom("thead > tr > th").hasText("Header");
  });
});
