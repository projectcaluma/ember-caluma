import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cf-field/input/checkbox", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(12);

    await render(hbs`
      <CfField::Input::Checkbox
        @field={{hash
          id="test"
          answer=(hash
            value=(array "option-1" "option-2")
          )
          options=(array
            (hash slug="option-1" label="Option 1")
            (hash slug="option-2" label="Option 2")
            (hash slug="option-3" label="Option 3")
          )
          question=(hash
            __typename="MultipleChoiceQuestion"
          )
        }}
      />
    `);

    assert.dom("input[type=checkbox]").exists({ count: 3 });
    assert.dom("label").exists({ count: 3 });
    assert.dom("br").exists({ count: 2 });
    assert.dom("label:nth-of-type(3) + br").doesNotExist();

    assert.dom("label:nth-of-type(1)").hasText("Option 1");
    assert.dom("label:nth-of-type(2)").hasText("Option 2");
    assert.dom("label:nth-of-type(3)").hasText("Option 3");

    assert
      .dom("label:nth-of-type(1) input[type=checkbox]")
      .hasValue("option-1");
    assert
      .dom("label:nth-of-type(2) input[type=checkbox]")
      .hasValue("option-2");
    assert
      .dom("label:nth-of-type(3) input[type=checkbox]")
      .hasValue("option-3");

    assert.dom("label:nth-of-type(1) input[type=checkbox]").isChecked();
    assert.dom("label:nth-of-type(2) input[type=checkbox]").isChecked();
  });

  test("it can be disabled", async function (assert) {
    assert.expect(3);

    await render(hbs`
      <CfField::Input::Checkbox
        @disabled={{true}}
        @field={{hash
          options=(array
            (hash slug="option-1" label="Option 1")
            (hash slug="option-2" label="Option 2")
            (hash slug="option-3" label="Option 3")
          )
          question=(hash
            __typename="MultipleChoiceQuestion"
          )
        }}
      />
    `);

    assert.dom("label:nth-of-type(1) input[type=checkbox]").isDisabled();
    assert.dom("label:nth-of-type(2) input[type=checkbox]").isDisabled();
    assert.dom("label:nth-of-type(3) input[type=checkbox]").isDisabled();
  });

  test("it triggers save on click", async function (assert) {
    assert.expect(3);

    this.set("value", []);
    this.set("save", (value) => this.set("value", value));

    await render(hbs`
      <CfField::Input::Checkbox
        @onSave={{this.save}}
        @field={{hash
          answer=(hash
            value=value
          )
          options=(array
            (hash slug="option-1" label="Option 1")
            (hash slug="option-2" label="Option 2")
          )
          question=(hash
            __typename="MultipleChoiceQuestion"
          )
        }}
      />
    `);

    await click("label:nth-of-type(1) input");
    assert.deepEqual(this.value, ["option-1"]);

    await click("label:nth-of-type(2) input");
    assert.deepEqual(this.value, ["option-1", "option-2"]);

    await click("label:nth-of-type(1) input");
    assert.deepEqual(this.value, ["option-2"]);
  });

  test("it renders disabled options", async function (assert) {
    assert.expect(2);

    this.set("disabled", false);

    await render(hbs`
      <CfField::Input::Checkbox
        @disabled={{this.disabled}}
        @field={{hash
          options=(array
            (hash slug="option-disabled" label="Option Disabled" disabled=true)
          )
          question=(hash
            __typename="MultipleChoiceQuestion"
          )
        }}
      />
    `);

    assert
      .dom("label del.uk-text-muted")
      .hasAttribute("title", "t:caluma.form.optionNotAvailable:()");

    this.set("disabled", true);

    assert.dom("label del.uk-text-muted").doesNotExist();
  });
});
