import { fillIn, render } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module(
  "Integration | Component | cf-field/input/number-separator",
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.beforeEach(function () {
      setLocale(["de-ch", "de"]);

      this.field = new (class {
        questionType = "IntegerQuestion";
        question = { isCalculated: false };
        @tracked value = null;
      })();

      this.save = (value) => {
        this.field.value = value;
      };
    });

    test("it converts integers to formatted strings and saves them properly", async function (assert) {
      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "1234");

      assert.strictEqual(this.field.value, 1234);
      assert.dom("input").hasValue("1’234");
    });

    test("it converts floats to formatted strings and saves them properly", async function (assert) {
      this.field.questionType = "FloatQuestion";

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "1234.123");

      assert.strictEqual(this.field.value, 1234.123);
      assert.dom("input").hasValue("1’234.123");
    });

    test("it displays calculated floats properly", async function (assert) {
      this.field.questionType = "CalculatedFloatQuestion";
      this.field.question.isCalculated = true;
      this.field.value = 1234.123;

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} />`,
      );

      assert.dom("input").hasAttribute("readonly");
      assert.dom("input").hasClass("uk-disabled");
      assert.dom("input").hasValue("1’234.123");
    });

    test("it works with other locales", async function (assert) {
      setLocale(["en-us", "en"]);

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "1234.123");

      assert.strictEqual(this.field.value, 1234.123);
      assert.dom("input").hasValue("1,234.123");
    });
  },
);
