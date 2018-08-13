import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";

module("Integration | Component | cfb-form-list", function(hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test("it renders blockless", async function(assert) {
    assert.expect(5);

    this.server.createList("form", 5);

    await render(hbs`{{cfb-form-list}}`);

    assert.dom("table").exists();
    assert.dom("table > thead").exists();
    assert.dom("table > tbody").exists();
    assert.dom("table > thead > tr").exists({ count: 1 });
    assert.dom("table > tbody > tr").exists({ count: 5 });
  });

  test("it displays an empty state", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cfb-form-list}}`);

    assert.dom("table > tbody > tr > td").hasText("No forms found");
  });

  test("it can trigger editing of a row", async function(assert) {
    assert.expect(2);

    this.server.create("form");

    this.set("on-edit-form", () => assert.step("edit-form"));

    await render(hbs`{{cfb-form-list on-edit-form=(action on-edit-form)}}`);

    await click("table > tbody > tr:first-of-type");

    assert.verifySteps(["edit-form"]);
  });

  test("it renders block style", async function(assert) {
    assert.expect(3);

    this.server.createList("form", 5);

    await render(hbs`
      {{#cfb-form-list as |table|}}
        {{#table.head}}
          <tr>
            <th>Key 1</th>
            <th>Key 2</th>
          </tr>
        {{/table.head}}

        {{#table.body as |row|}}
          <tr>
            <td>{{row.node.id}}</td>
            <td>{{row.node.name}}</td>
          </tr>
        {{/table.body}}
      {{/cfb-form-list}}
    `);

    assert.dom("table > thead > tr:first-of-type > th").exists({ count: 2 });
    assert.dom("table > tbody > tr:first-of-type > td").exists({ count: 2 });
    assert.dom("table > tbody > tr").exists({ count: 5 });
  });
});
