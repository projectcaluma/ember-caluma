import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | ca-field-selector-list/ca-field-alias-input",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      assert.expect(4);

      this.set("alias", "some-alias");
      this.set("onSave", (newAlias) => {
        assert.step("save");
        this.set("alias", newAlias);
      });

      await render(
        hbs`<CaFieldSelectorList::CaFieldAliasInput
  @value={{this.alias}}
  @onInput={{this.onSave}}
/>`,
        { owner: this.engine },
      );
      assert.dom("[data-test-field-alias-input]").hasValue(this.alias);

      await fillIn("[data-test-field-alias-input]", "changed alias");

      assert.verifySteps(["save"]);
      assert.dom("[data-test-field-alias-input]").hasValue("changed alias");
    });
  },
);
