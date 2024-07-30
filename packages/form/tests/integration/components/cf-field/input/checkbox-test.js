import { render, click, settled } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { hbs } from "ember-cli-htmlbars";
import { timeout } from "ember-concurrency";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/checkbox", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(12);

    await render(hbs`<CfField::Input::Checkbox
  @field={{hash
    id="test"
    answer=(hash value=(array "option-1" "option-2"))
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
      (hash slug="option-3" label="Option 3")
    )
    question=(hash __typename="MultipleChoiceQuestion")
  }}
/>`);

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

  test("it renders options of a checkbox field vertically", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfField::Input::Checkbox
  @field={{hash
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
    )
    raw=(hash
      question=(hash
        __typename="MultipleChoiceQuestion" meta=(hash vertical=true)
      )
    )
    answer=(hash value=(array "option-1"))
  }}
/>`);

    assert.dom("label.uk-margin-large-right").exists();
  });

  test("it can be disabled", async function (assert) {
    assert.expect(3);

    await render(hbs`<CfField::Input::Checkbox
  @disabled={{true}}
  @field={{hash
    options=(array
      (hash slug="option-1" label="Option 1")
      (hash slug="option-2" label="Option 2")
      (hash slug="option-3" label="Option 3")
    )
    question=(hash __typename="MultipleChoiceQuestion")
  }}
/>`);

    assert.dom("label:nth-of-type(1) input[type=checkbox]").isDisabled();
    assert.dom("label:nth-of-type(2) input[type=checkbox]").isDisabled();
    assert.dom("label:nth-of-type(3) input[type=checkbox]").isDisabled();
  });

  test("it triggers save on click", async function (assert) {
    assert.expect(3);

    this.field = new (class {
      @tracked value = [];
      options = [
        { slug: "option-1", label: "Option 1" },
        { slug: "option-2", label: "Option 2" },
      ];
      question = {
        __typename: "MultipleChoiceQuestion",
        raw: {
          meta: {
            vertical: false,
          },
        },
      };
    })();

    this.save = async (value) => {
      this.field.value = value;
      await settled();
    };

    await render(
      hbs`<CfField::Input::Checkbox @onSave={{this.save}} @field={{this.field}} />`,
    );

    await click("label:nth-of-type(1) input");
    assert.deepEqual(this.field.value, ["option-1"]);

    await click("label:nth-of-type(2) input");
    assert.deepEqual(this.field.value, ["option-1", "option-2"]);

    await click("label:nth-of-type(1) input");
    assert.deepEqual(this.field.value, ["option-2"]);
  });

  test("it renders disabled options", async function (assert) {
    assert.expect(4);

    this.set("disabled", false);

    await render(hbs`<CfField::Input::Checkbox
  @disabled={{this.disabled}}
  @field={{hash
    options=(array
      (hash slug="option-disabled" label="Option Disabled" disabled=true)
    )
    question=(hash __typename="MultipleChoiceQuestion")
  }}
/>`);

    // the checkbox needs to be enabled in order to be deselected
    assert.dom("label input[type=checkbox]").isEnabled();
    assert
      .dom("label del.uk-text-muted")
      .hasAttribute("title", "This option is not available anymore");

    this.set("disabled", true);

    assert.dom("label input[type=checkbox]").isDisabled();
    assert.dom("label del.uk-text-muted").doesNotExist();
  });

  test("it handles fast selections correctly", async function (assert) {
    assert.expect(1);

    this.field = new (class {
      @tracked value = [];
      options = [
        { slug: "option-1", label: "Option 1" },
        { slug: "option-2", label: "Option 2" },
      ];
    })();

    this.save = async (value) => {
      await timeout(50);
      this.field.value = value;
      await settled();
    };

    await render(
      hbs`<CfField::Input::Checkbox @onSave={{this.save}} @field={{this.field}} />`,
    );

    // explicitly don't await the first click to trigger two concurrently
    // running save tasks
    click("label:nth-of-type(1) input");
    await click("label:nth-of-type(2) input");
    assert.deepEqual(this.field.value, ["option-1", "option-2"]);
  });
});
