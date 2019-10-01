import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cf-field/input/integer", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(7);

    await render(hbs`
      {{cf-field/input/integer
        field=(hash
          pk="test"
          answer=(hash
            value=3
          )
          question=(hash
            integerMinValue=1
            integerMaxValue=5
          )
        )
      }}
    `);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "number");
    assert.dom("input").hasAttribute("step", "1");
    assert.dom("input").hasAttribute("min", "1");
    assert.dom("input").hasAttribute("max", "5");
    assert.dom("input").hasValue("3");
  });

  test("it can be disabled", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field/input/integer disabled=true}}`);

    assert.dom("input").isDisabled();
  });

  test("it triggers save on input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, 1));

    await render(hbs`{{cf-field/input/integer onSave=save}}`);

    await fillIn("input", 1);
  });

  test("it does not allow non integer input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, null));

    await render(hbs`{{cf-field/input/integer onSave=save}}`);

    await fillIn("input", "Test");
  });
});
