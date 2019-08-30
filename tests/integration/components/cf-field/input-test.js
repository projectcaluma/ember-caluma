import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cf-field/input", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders a text field", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        field=(hash
          question=(hash
            __typename="TextQuestion"
          )
          answer=(hash
            value="Test"
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=text]").hasValue("Test");
  });

  test("it renders a textarea field", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        field=(hash
          question=(hash
            __typename="TextareaQuestion"
          )
          answer=(hash
            value="Test"
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("textarea").hasValue("Test");
  });

  test("it renders an integer field", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        field=(hash
          question=(hash
            __typename="IntegerQuestion"
          )
          answer=(hash
            value=5
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=number]").hasValue("5");
  });

  test("it renders a float field", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        field=(hash
          question=(hash
            __typename="FloatQuestion"
          )
          answer=(hash
            value=0.55
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=number]").hasValue("0.55");
  });

  test("it renders a radio field", async function(assert) {
    assert.expect(2);

    this.set("noop", () => {});

    await render(hbs`
      {{cf-field/input
        onSave=noop
        field=(hash
          options=(array
            (hash slug="option-1")
          )
          question=(hash
            __typename="RadioQuestion"
          )
          answer=(hash
            value="option-1"
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=radio][value='option-1']").isChecked();
  });

  test("it renders a checkbox field", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        field=(hash
          options=(array
            (hash slug="option-1")
          )
          question=(hash
            __typename="MultipleChoiceQuestion"
          )
          answer=(hash
            value=(array "option-1")
          )
        )
      }}
    `);

    assert.dom(".uk-form-controls").exists();
    assert.dom("input[type=checkbox][value='option-1']").isChecked();
  });

  test("it renders disabled fields", async function(assert) {
    assert.expect(2);

    await render(hbs`
      {{cf-field/input
        disabled=true
        field=(hash
          question=(hash
            __typename="TextQuestion"
          )
        )
      }}
    `);

    assert.dom("input[type=text]").hasAttribute("readonly");
    assert.dom("input[type=text]").hasClass("uk-disabled");
  });
});
