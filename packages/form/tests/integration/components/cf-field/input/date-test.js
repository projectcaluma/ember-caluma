import { fillIn, blur, render, waitFor } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/date", function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.resolveRegistration("config:environment")["ember-caluma"] = {
      FLATPICKR_DATE_FORMAT: {
        de: "d.m.Y",
        fr: "d.m.Y",
        en: "m/d/Y",
      },
      FLATPICKR_DATE_FORMAT_DEFAULT: "m/d/Y",
    };
  });

  test("it computes the proper element id", async function (assert) {
    await render(hbs`<CfField::Input::Date @field={{hash pk="test-id"}} />`);

    assert.dom("#test-id").exists();
  });

  test("it renders an input tag", async function (assert) {
    await render(hbs`<CfField::Input::Date />`);
    assert.ok(this.element);
  });

  test("it triggers save when selecting a date", async function (assert) {
    assert.expect(1);

    this.save = (value) => assert.strictEqual(value, "2013-04-28");

    await render(hbs`<CfField::Input::Date @onSave={{this.save}} />`);

    await setFlatpickrDate("input", new Date(2013, 3, 28)); // month is zero based
  });

  test("it renders disabled", async function (assert) {
    setLocale(["de-ch", "de"]);

    this.field = { answer: { value: "2021-09-10" } };

    await render(
      hbs`<CfField::Input::Date @disabled={{true}} @field={{this.field}} />`,
    );

    await waitFor(".ember-flatpickr-input.input");

    assert.dom(".ember-flatpickr-input.input").hasAttribute("type", "text");
    assert.dom(".ember-flatpickr-input.input").hasValue("10.09.2021");
    assert
      .dom(".ember-flatpickr-input.flatpickr-input")
      .hasAttribute("readonly");
    assert
      .dom(".ember-flatpickr-input.flatpickr-input")
      .hasClass("uk-disabled");
    assert.dom(".ember-flatpickr-input.flatpickr-input").hasValue("2021-09-10");
  });

  test("it works on input", async function (assert) {
    this.value = null;

    await render(hbs`<CfField::Input::Date @onSave={{fn (mut this.value)}} />`);

    await setLocale("en-us");
    await fillIn(".ember-flatpickr-input.input", "something");
    await blur();
    assert.strictEqual(this.value, null);
    assert.dom(".ember-flatpickr-input.input").hasValue("");
    assert.dom(".ember-flatpickr-input.flatpickr-input").hasValue("");

    await fillIn(".ember-flatpickr-input.input", "1/30/2013");
    await blur();
    assert.strictEqual(this.value, "2013-01-30");
    assert.dom(".ember-flatpickr-input.input").hasValue("01/30/2013");
    assert.dom(".ember-flatpickr-input.flatpickr-input").hasValue("2013-01-30");

    await setLocale("de-ch");
    await fillIn(".ember-flatpickr-input.input", "20.2.2022");
    await blur();
    assert.strictEqual(this.value, "2022-02-20");
    assert.dom(".ember-flatpickr-input.input").hasValue("20.02.2022");
    assert.dom(".ember-flatpickr-input.flatpickr-input").hasValue("2022-02-20");

    await fillIn(".ember-flatpickr-input.input", "25.03.2021");
    await blur();
    assert.strictEqual(this.value, "2021-03-25");
    assert.dom(".ember-flatpickr-input.input").hasValue("25.03.2021");
    assert.dom(".ember-flatpickr-input.flatpickr-input").hasValue("2021-03-25");
  });
});
