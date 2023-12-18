import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/radio", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.set("noop", () => {});
  });

  test("it renders", async function (assert) {
    assert.expect(11);

    await render(hbs`<CfField::Input::Radio
  @onSave={{this.noop}}
  @field={{hash
    pk="test"
    answer=(hash value="option-1")
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
      (hash slug="option-3" label="Option 3")
    )
    question=(hash __typename="ChoiceQuestion")
  }}
/>`);

    assert.dom("input[type=radio]").exists({ count: 3 });
    assert.dom("label").exists({ count: 3 });
    assert.dom("br").exists({ count: 2 });
    assert.dom("label:nth-of-type(3) + br").doesNotExist();

    assert.dom("label:nth-of-type(1)").hasText("Option 1");
    assert.dom("label:nth-of-type(2)").hasText("Option 2");
    assert.dom("label:nth-of-type(3)").hasText("Option 3");

    assert.dom("label:nth-of-type(1) input[type=radio]").hasValue("option-1");
    assert.dom("label:nth-of-type(2) input[type=radio]").hasValue("option-2");
    assert.dom("label:nth-of-type(3) input[type=radio]").hasValue("option-3");

    assert.dom("label:nth-of-type(1) input[type=radio]").isChecked();
  });

  test("it renders options of a radio field vertically", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfField::Input::Radio
  @onSave={{this.noop}}
  @field={{hash
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
    )
    question=(hash __typename="ChoiceQuestion")
    raw=(hash question=(hash meta=(hash vertical=true)))
  }}
/>`);

    assert.dom("label.uk-margin-large-right").exists();
  });

  test("it can be disabled", async function (assert) {
    assert.expect(3);

    await render(hbs`<CfField::Input::Radio
  @onSave={{this.noop}}
  @disabled={{true}}
  @field={{hash
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
      (hash slug="option-3" label="Option 3")
    )
    question=(hash __typename="ChoiceQuestion")
  }}
/>`);

    assert.dom("label:nth-of-type(1) input[type=radio]").isDisabled();
    assert.dom("label:nth-of-type(2) input[type=radio]").isDisabled();
    assert.dom("label:nth-of-type(3) input[type=radio]").isDisabled();
  });

  test("it triggers save on click", async function (assert) {
    this.set("value", false);
    this.set("raw", { isRequired: "false" });
    this.set("onSave", (value) => {
      this.set("value", value);
      assert.step("save");
    });

    await render(hbs`<CfField::Input::Radio
  @onSave={{this.onSave}}
  @field={{hash
    options=(array (hash slug="option-1" label="Option 1"))
    answer=(hash value=this.value)
    question=(hash __typename="ChoiceQuestion" slug="test" raw=this.raw)
  }}
/>`);

    await click("label:nth-of-type(1) input");
    await click("[data-test-radio-reset]");

    assert.verifySteps(["save", "save"]);

    this.set("raw", { isRequired: "true" });
    await click("label:nth-of-type(1) input");

    assert.verifySteps(["save"]);
    assert.dom("[data-test-radio-reset]").isNotVisible();
  });

  test("it renders disabled options", async function (assert) {
    assert.expect(4);

    this.set("disabled", false);

    await render(hbs`<CfField::Input::Radio
  @onSave={{this.noop}}
  @disabled={{this.disabled}}
  @field={{hash
    options=(array
      (hash slug="option-disabled" label="Option Disabled" disabled=true)
    )
    question=(hash __typename="ChoiceQuestion")
  }}
/>`);

    assert.dom("label input[type=radio]").isDisabled();
    assert
      .dom("label del.uk-text-muted")
      .hasAttribute("title", "t:caluma.form.optionNotAvailable:()");

    this.set("disabled", true);

    assert.dom("label input[type=radio]").isDisabled();
    assert.dom("label del.uk-text-muted").doesNotExist();
  });
});
