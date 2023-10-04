import { fillIn, blur, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { setupIntl, setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/date", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

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

    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasAttribute("type", "text");
    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasValue("10.09.2021");
    assert
      .dom(".ember-flatpickr-input[type='hidden']")
      .hasAttribute("readonly");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasClass("uk-disabled");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("2021-09-10");
  });

  test("it works on input", async function (assert) {
    this.value = null;

    await render(hbs`<CfField::Input::Date @onSave={{fn (mut this.value)}} />`);

    await setLocale("en-us");
    await fillIn(".ember-flatpickr-input:not([type='hidden'])", "something");
    await blur();
    assert.strictEqual(this.value, null);
    assert.dom(".ember-flatpickr-input:not([type='hidden'])").hasValue("");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("");

    await fillIn(".ember-flatpickr-input:not([type='hidden'])", "1/30/2013");
    await blur();
    assert.strictEqual(this.value, "2013-01-30");
    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasValue("01/30/2013");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("2013-01-30");

    await setLocale("de-ch");
    await fillIn(".ember-flatpickr-input:not([type='hidden'])", "20.2.2022");
    await blur();
    assert.strictEqual(this.value, "2022-02-20");
    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasValue("20.02.2022");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("2022-02-20");

    await fillIn(".ember-flatpickr-input:not([type='hidden'])", "25.03.2021");
    await blur();
    assert.strictEqual(this.value, "2021-03-25");
    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasValue("25.03.2021");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("2021-03-25");
  });

  test("the date accept min date and max date", async function (assert) {
    this.value = null;
    this.field = {
      question: {
        raw: {
          minDate: "2023-01-01",
          maxDate: "2024-01-01",
        },
      },
    };

    await render(
      hbs`<CfField::Input::Date @field={{this.field}} @onSave={{fn (mut this.value)}} />`,
    );

    await setLocale("en-us");
    await setFlatpickrDate("input", new Date(2023, 6, 10)); // month is zero based
    assert.strictEqual(this.value, "2023-07-10");
    assert
      .dom(".ember-flatpickr-input:not([type='hidden'])")
      .hasValue("07/10/2023");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("2023-07-10");

    // the date here is less then the min dafined date
    await setFlatpickrDate("input", new Date(2022, 6, 10)); // month is zero based
    assert.strictEqual(this.value, null);
    assert.dom(".ember-flatpickr-input:not([type='hidden'])").hasValue("");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("");

    // the date here is more then the max defined date
    await setFlatpickrDate("input", new Date(2024, 6, 10)); // month is zero based
    assert.strictEqual(this.value, null);
    assert.dom(".ember-flatpickr-input:not([type='hidden'])").hasValue("");
    assert.dom(".ember-flatpickr-input[type='hidden']").hasValue("");
  });
});
