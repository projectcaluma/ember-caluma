import { fillIn, blur, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { setupIntl, setLocale } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/date", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

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
      hbs`<CfField::Input::Date @disabled={{true}} @field={{this.field}} />`
    );

    assert.dom("input").hasAttribute("type", "text");
    assert.dom("input").hasAttribute("readonly");
    assert.dom("input").hasClass("uk-disabled");
    assert.dom("input").hasValue("10.09.2021");
  });

  test("it works on input", async function (assert) {
    this.value = null;

    await render(hbs`<CfField::Input::Date @onSave={{fn (mut this.value)}} />`);

    setLocale("en-us");
    await fillIn("input", "something");
    await blur();
    assert.strictEqual(this.value, null);

    await fillIn("input", "1/1/2013");
    await blur();
    assert.strictEqual(this.value, "2013-01-01");

    setLocale("de-ch");
    await fillIn("input", "1.1.2022");
    await blur();
    assert.strictEqual(this.value, "2022-01-01");

    await fillIn("input", "01.01.2022");
    await blur();
    assert.strictEqual(this.value, "2022-01-01");
  });
});
