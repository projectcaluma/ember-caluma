import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders a text field", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @field={{hash
    question=(hash raw=(hash __typename="TextQuestion"))
    answer=(hash value="Test")
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=text]").hasValue("Test");
  });

  test("it renders a textarea field", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @field={{hash
    question=(hash raw=(hash __typename="TextareaQuestion"))
    answer=(hash value="Test")
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("textarea").hasValue("Test");
  });

  test("it renders an integer field", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @field={{hash
    question=(hash raw=(hash __typename="IntegerQuestion"))
    answer=(hash value=5)
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=number]").hasValue("5");
  });

  test("it renders a float field", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @field={{hash
    question=(hash raw=(hash __typename="FloatQuestion"))
    value=0.55
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=number]").hasValue("0.55");
  });

  test("it renders a radio field", async function (assert) {
    assert.expect(2);

    this.set("noop", () => {});

    await render(hbs`<CfField::Input
  @onSave={{this.noop}}
  @field={{hash
    options=(array (hash slug="option-1"))
    question=(hash raw=(hash __typename="ChoiceQuestion"))
    answer=(hash value="option-1")
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=radio][value='option-1']").isChecked();
  });

  test("it renders a checkbox field", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @field={{hash
    options=(array (hash slug="option-1"))
    question=(hash raw=(hash __typename="MultipleChoiceQuestion"))
    answer=(hash value=(array "option-1"))
  }}
/>`);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=checkbox][value='option-1']").isChecked();
  });

  test("it renders disabled fields", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input
  @disabled={{true}}
  @field={{hash question=(hash raw=(hash __typename="TextQuestion"))}}
/>`);

    assert.dom("input[type=text]").hasAttribute("readonly");
    assert.dom("input[type=text]").hasClass("uk-disabled");
  });
});
