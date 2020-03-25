import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import setupMirage from "ember-cli-mirage/test-support/setup-mirage";
import { click } from "@ember/test-helpers";

module(
  "Integration | Component | cfb-form-editor/question/validation",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
      this.server.createList("format-validator", 5);
    });

    test("it renders all available validators", async function (assert) {
      assert.expect(2);

      await render(hbs`{{cfb-form-editor/question/validation}}`);

      await click(".ember-power-select-trigger-multiple-input");

      assert.dom(".ember-power-select-option").exists({ count: 5 });
      assert.dom(".ember-power-select-option").hasText("Validator #1");
    });
  }
);
