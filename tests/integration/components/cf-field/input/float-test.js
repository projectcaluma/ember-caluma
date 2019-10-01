import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cf-field/input/float", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(7);

    await render(hbs`
      {{cf-field/input/float
        field=(hash
          pk="test"
          answer=(hash
            value=1.045
          )
          question=(hash
            floatMinValue=0.4
            floatMaxValue=1.4
          )
        )
      }}
    `);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "number");
    assert.dom("input").hasAttribute("step", "0.001");
    assert.dom("input").hasAttribute("min", "0.4");
    assert.dom("input").hasAttribute("max", "1.4");
    assert.dom("input").hasValue("1.045");
  });

  test("it can be disabled", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field/input/float disabled=true}}`);

    assert.dom("input").isDisabled();
  });

  test("it triggers save on input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, 1.5));

    await render(hbs`{{cf-field/input/float onSave=save}}`);

    await fillIn("input", 1.5);
  });

  test("it does not allow non float input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, null));

    await render(hbs`{{cf-field/input/float onSave=save}}`);

    await fillIn("input", "Test");
  });
});
