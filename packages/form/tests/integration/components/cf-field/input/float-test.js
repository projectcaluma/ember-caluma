import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cf-field/input/float", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.set("field", {
      pk: "test-id",
      value: 1.045,
      question: {
        isCalculated: false,
        floatMinValue: 0.4,
        floatMaxValue: 1.4,
      },
    });
  });

  test("it computes the proper element id", async function (assert) {
    await render(hbs`<CfField::input::float @field={{this.field}} />`);

    assert.dom("#test-id").exists();
  });

  test("it renders", async function (assert) {
    assert.expect(7);

    await render(hbs`<CfField::input::float @field={{this.field}} />`);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test-id");
    assert.dom("input").hasAttribute("type", "number");
    assert.dom("input").hasAttribute("step", "0.001");
    assert.dom("input").hasAttribute("min", "0.4");
    assert.dom("input").hasAttribute("max", "1.4");
    assert.dom("input").hasValue("1.045");
  });

  test("it can be disabled", async function (assert) {
    assert.expect(2);

    await render(
      hbs`<CfField::input::float
        @field={{this.field}}
        @disabled={{true}}
      />`
    );

    assert.dom("input").hasAttribute("readonly");
    assert.dom("input").hasClass("uk-disabled");
  });

  test("it triggers save on input", async function (assert) {
    assert.expect(1);

    this.set("save", (value) => assert.strictEqual(value, 1.5));

    await render(
      hbs`<CfField::input::float
        @field={{this.field}}
        @onSave={{this.save}}
      />`
    );

    await fillIn("input", 1.5);
  });

  test("it does not allow non float input", async function (assert) {
    assert.expect(1);

    this.set("save", (value) => assert.strictEqual(value, null));

    await render(
      hbs`<CfField::input::float
        @field={{this.field}}
        @onSave={{this.save}}
      />`
    );

    await fillIn("input", "Test");
  });
});
