import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";

module("Integration | Component | cf-field/input/text", function(hooks) {
  setupRenderingTest(hooks);

  test("it computes the proper element id", async function(assert) {
    await render(hbs`{{cf-field/input/text field=(hash pk="test-id")}}`);

    assert.dom("#test-id").exists();
  });

  test("it renders", async function(assert) {
    assert.expect(4);

    await render(hbs`
      {{cf-field/input/text
        field=(hash
          pk="test"
          answer=(hash
            value="Test"
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
    assert.expect(2);

    await render(hbs`{{cf-field/input/text disabled=true}}`);

    assert.dom("input").hasAttribute("readonly");
    assert.dom("input").hasClass("uk-disabled");
  });

  test("it triggers save on input", async function(assert) {
    assert.expect(1);

    this.set("save", value => assert.equal(value, "Test"));

    await render(hbs`{{cf-field/input/text onSave=save}}`);

    await fillIn("input", "Test");
  });
});
