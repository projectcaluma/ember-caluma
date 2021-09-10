import { click, render } from "@ember/test-helpers";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl, setLocale } from "ember-intl/test-support";
import { Interactor } from "ember-pikaday/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Integration | Component | cf-field/input/date", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.owner.register("service:validator", ValidatorServiceStub);
  });

  test("it computes the proper element id", async function (assert) {
    await render(hbs`<CfField::input::date @field={{hash pk="test-id"}} />`);

    assert.dom("#test-id").exists();
  });

  test("it renders an input tag", async function (assert) {
    await render(hbs`<CfField::input::date />`);
    assert.ok(this.element);
  });

  test("it triggers save when selecting a date", async function (assert) {
    assert.expect(1);

    const expectedDate = new Date(Date.UTC(2013, 3, 28));

    this.set("save", function (selectedDate) {
      assert.deepEqual(
        selectedDate,
        moment({
          day: expectedDate.getUTCDate(),
          month: expectedDate.getUTCMonth(),
          year: expectedDate.getUTCFullYear(),
        }).format(moment.HTML5_FMT.DATE)
      );
    });

    await render(hbs`<CfField::input::date @onSave={{this.save}} />`);

    await click("input");
    await Interactor.selectDate(expectedDate);
  });

  test("it renders disabled", async function (assert) {
    setLocale("de");

    this.field = { answer: { value: "2021-09-10" } };

    await render(hbs`
      <CfField::input::date
        @disabled={{true}}
        @field={{this.field}}
      />
    `);

    assert.dom("input").hasAttribute("type", "text");
    assert.dom("input").hasAttribute("readonly");
    assert.dom("input").hasClass("uk-disabled");
    assert.dom("input").hasValue("10.09.2021");
  });
});
