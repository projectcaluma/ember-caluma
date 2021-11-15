import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test, todo } from "qunit";
import { Changeset } from "validated-changeset";

module("Integration | Component | ca-field-details", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function (assert) {
    this.set("onUpdate", () => {
      assert.step("update");
    });
    const filter = ["filt3r", "1234"];
    this.set("field", new Changeset({ alias: "test", filter, show: true }));
  });

  test("it renders", async function (assert) {
    await render(hbs`<CaFieldDetails />`);

    assert
      .dom(this.element)
      .hasText(
        "t:caluma.analytics.show_output:() t:caluma.analytics.add_filter:()"
      );
  });

  test("it renders field data in input elements", async function (assert) {
    await render(hbs`<CaFieldDetails @field={{this.field}}/>`);

    assert.dom("input[name=alias]").exists({ count: 1 });
    // assert.dom("input[name=alias]").containsText("test");
    assert.dom("input[name=show-in-output]").isChecked();
    assert.dom("[data-test-selector-filter]").exists();
  });

  todo("it triggers the update action on change", function (assert) {
    assert.verifySteps(["update"]);
  });
});
