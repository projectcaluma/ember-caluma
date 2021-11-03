import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | cfb-form-editor/question/validation",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      this.server.createList("format-validator", 5);
    });

    test("it renders all available validators", async function (assert) {
      assert.expect(2);

      await render(hbs`<CfbFormEditor::Question::Validation/>`);

      await click(".ember-power-select-trigger");

      assert.dom(".ember-power-select-option").exists({ count: 5 });
      assert.dom(".ember-power-select-option").hasText("Validator #1");
    });
  }
);
