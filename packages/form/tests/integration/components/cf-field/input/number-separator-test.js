import { fillIn, render, triggerKeyEvent } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";
import { stub } from "sinon";

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

      await fillIn("input", "0");
      assert.dom("input").hasValue("0");
    });

    test("it converts floats to formatted strings and saves them properly", async function (assert) {
      this.field.questionType = "FloatQuestion";

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "1234.123");

      assert.strictEqual(this.field.value, 1234.123);
      assert.dom("input").hasValue("1’234.123");

      await fillIn("input", "0");
      assert.dom("input").hasValue("0");
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

    test("it blocks invalid characters for integer questions", async function (assert) {
      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "10");
      assert.dom("input").hasValue("10");

      await triggerKeyEvent("input", "keydown", "A");
      assert.dom("input").hasValue("10");

      await triggerKeyEvent("input", "keydown", ",");
      assert.dom("input").hasValue("10");

      await triggerKeyEvent("input", "keydown", ".");
      assert.dom("input").hasValue("10");
    });

    test("it blocks invalid characters for float questions", async function (assert) {
      this.field.questionType = "FloatQuestion";

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      await fillIn("input", "10.55");
      assert.dom("input").hasValue("10.55");

      await triggerKeyEvent("input", "keydown", "A");
      assert.dom("input").hasValue("10.55");

      await triggerKeyEvent("input", "keydown", ",");
      assert.dom("input").hasValue("10.55");

      await triggerKeyEvent("input", "keydown", ".");
      assert.dom("input").hasValue("10.55");
    });

    test("triggers a warning exactly once after 6 attempts", async function (assert) {
      const service = this.owner.lookup("service:notification");
      const warning = stub(service, "warning");

      await render(
        hbs`<CfField::Input::NumberSeparator @field={{this.field}} @onSave={{this.save}} />`,
      );

      assert.ok(warning.notCalled);

      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      // this one should trigger the notification
      await triggerKeyEvent("input", "keydown", ",");

      assert.ok(warning.called);
      assert.ok(warning.calledOnce);
      assert.strictEqual(
        warning.args[0][0],
        "In diesem Feld sind nur folgende Zeichen erlaubt: 0-9 ’ .",
      );

      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      await triggerKeyEvent("input", "keydown", ",");
      // this one does not trigger the notification again
      await triggerKeyEvent("input", "keydown", ",");

      assert.ok(warning.calledOnce);
      assert.notOk(warning.calledTwice);
    });
  },
);
