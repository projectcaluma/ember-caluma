import { render, fillIn, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | ca-field-selector-list/ca-field-alias-input",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks, ["en"]);

    test("it renders", async function (assert) {
      assert.expect(7);

      this.set("alias", "some-alias");
      this.set("onSave", (newAlias) => {
        assert.step("save");
        this.set("alias", newAlias);
      });

      await render(
        hbs`<CaFieldSelectorList::CaFieldAliasInput @value={{this.alias}} @onSave={{this.onSave}} />`
      );
      assert.dom("[data-test-delete-field]").isNotVisible();
      assert.dom("[data-test-field-alias-input]").hasValue(this.alias);

      await fillIn("[data-test-field-alias-input]", "changed alias");

      assert.dom("[data-test-delete-field]").isVisible();
      assert
        .dom("[data-test-delete-field]")
        .hasText(this.intl.t("caluma.analytics.edit.delete-field"));

      await click("button[data-test-delete-field]");

      assert.verifySteps(["save"]);
      assert.dom("[data-test-field-alias-input]").hasValue("changed alias");
    });
  }
);
