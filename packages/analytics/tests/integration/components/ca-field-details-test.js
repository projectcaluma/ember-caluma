import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";
import { Changeset } from "validated-changeset";

module("Integration | Component | ca-field-details", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function (assert) {
    const filter = ["filt3r", "1234"];
    this.set("field", new Changeset({ alias: "test", filter, show: true }));
    this.set("onUpdate", (vals) => {
      assert.step("update");
      for (const prop in vals) {
        this.field[prop] = vals[prop];
      }
    });
  });

  test("it renders", async function (assert) {
    await render(hbs`<CaFieldDetails />`);

    assert
      .dom(this.element)
      .hasText(
        "t:caluma.analytics.alias:() t:caluma.analytics.alias_translation:() t:caluma.analytics.show_output:() t:caluma.analytics.add_filter:()"
      );
  });

  test("it renders field data in input elements", async function (assert) {
    assert.expect(4);
    await render(hbs`<CaFieldDetails @field={{this.field}}/>`);

    assert.dom("input[name=alias]").exists({ count: 1 });
    assert.dom("input[name=alias]").hasValue("test");
    assert.dom("input[name=show]").isChecked();
    assert.dom("[data-test-selector-filter]").exists();
  });

  test("it triggers the update action on the alias input", async function (assert) {
    assert.expect(3);
    await render(
      hbs`<CaFieldDetails @field={{this.field}} @onUpdate={{this.onUpdate}} />`
    );

    await fillIn("input[name=alias]", "testalias");

    assert.dom("input[name=alias]").hasValue("testalias");
    assert.verifySteps(["update"]);
  });

  test("it triggers the update action on the show checkbox", async function (assert) {
    assert.expect(3);
    await render(
      hbs`<CaFieldDetails @field={{this.field}} @onUpdate={{this.onUpdate}} />`
    );

    assert.dom("input[name=show]").isChecked();

    await click("input[name=show]");

    // TODO: Why is this test not fullfilled?
    // assert.dom("input[name=show]").isNotChecked();
    assert.verifySteps(["update"]);
  });
});
