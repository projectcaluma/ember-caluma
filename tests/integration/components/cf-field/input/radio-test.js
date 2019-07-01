import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/radio", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set("noop", () => {});
  });

  test("it renders", async function(assert) {
    assert.expect(11);

    await render(hbs`
      {{cf-field/input/radio
        onSave=noop
        field=(hash
          id="test"
          answer=(hash
            value="option-1"
          )
          question=(hash
            choiceOptions=(hash
              edges=(array
                (hash node=(hash slug="option-1" label="Option 1"))
                (hash node=(hash slug="option-2" label="Option 2"))
                (hash node=(hash slug="option-3" label="Option 3"))
              )
            )
            __typename="ChoiceQuestion"
          )
        )
      }}
    `);

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

  test("it can be disabled", async function(assert) {
    assert.expect(3);

    await render(hbs`
      {{cf-field/input/radio
        onSave=noop
        disabled=true
        field=(hash
          question=(hash
            choiceOptions=(hash
              edges=(array
                (hash node=(hash slug="option-1" label="Option 1"))
                (hash node=(hash slug="option-2" label="Option 2"))
                (hash node=(hash slug="option-3" label="Option 3"))
              )
            )
            __typename="ChoiceQuestion"
          )
        )
      }}
    `);

    assert.dom("label:nth-of-type(1) input[type=radio]").isDisabled();
    assert.dom("label:nth-of-type(2) input[type=radio]").isDisabled();
    assert.dom("label:nth-of-type(3) input[type=radio]").isDisabled();
  });

  test("it triggers save on click", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, "option-1"));

    await render(hbs`
      {{cf-field/input/radio
        onSave=save
        field=(hash
          question=(hash
            choiceOptions=(hash
              edges=(array
                (hash node=(hash slug="option-1" label="Option 1"))
              )
            )
            __typename="ChoiceQuestion"
          )
        )
      }}
    `);

    await click("label:nth-of-type(1) input");
  });
});
