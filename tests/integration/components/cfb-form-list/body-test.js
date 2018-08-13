import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-form-list/body", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    this.set("rows", [1, 2, 3]);

    await render(hbs`
      {{#cfb-form-list/body rows=rows as |row|}}
        <tr>
          <td>{{row}}</td>
        </tr>
      {{/cfb-form-list/body}}
    `);

    assert.dom("tbody").exists();
    assert.dom("tbody > tr").exists({ count: 3 });
  });

  test("it renders a loading state", async function(assert) {
    await render(hbs`
      {{#cfb-form-list/body loading=true as |row|}}
        <tr>
          <td>{{row}}</td>
        </tr>
      {{/cfb-form-list/body}}
    `);

    assert.dom("tbody > tr > td > [uk-spinner]").exists();
  });

  test("it renders an empty state", async function(assert) {
    this.set("rows", []);

    await render(hbs`
      {{#cfb-form-list/body rows=rows as |row|}}
        <tr>
          <td>{{row}}</td>
        </tr>
      {{/cfb-form-list/body}}
    `);

    assert.dom("tbody > tr > td").hasText("No forms found");
  });
});
