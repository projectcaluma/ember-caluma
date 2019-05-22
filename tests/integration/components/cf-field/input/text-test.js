import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cf-field/input/text", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function(assert) {
    assert.expect(4);

    await render(hbs`
      {{cf-field/input/text
        field=(hash
          id="test"
          answer=(hash
            stringValue="Test"
          )
          question=(hash
            textMaxLength=5
          )
        )
      }}
    `);

    assert.dom("input").hasClass("uk-input");
    assert.dom("input").hasAttribute("name", "test");
    assert.dom("input").hasAttribute("type", "text");
    assert.dom("input").hasValue("Test");
  });

  test("it can be disabled", async function(assert) {
    assert.expect(1);

    await render(hbs`{{cf-field/input/text disabled=true}}`);

    assert.dom("input").hasAttribute("readonly");
  });

  test("it triggers save on input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, "Test"));

    await render(hbs`{{cf-field/input/text onSave=save}}`);

    await fillIn("input", "Test");
  });
});
