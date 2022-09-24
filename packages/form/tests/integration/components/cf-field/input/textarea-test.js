import { render, fillIn } from "@ember/test-helpers";
import { setupRenderingTest } from "dummy/tests/helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

module("Integration | Component | cf-field/input/textarea", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it computes the proper element id", async function (assert) {
    await render(
      hbs`<CfField::Input::Textarea @field={{hash pk="test-id"}} />`
    );

    assert.dom("#test-id").exists();
  });

  test("it renders", async function (assert) {
    assert.expect(4);

    await render(hbs`
      <CfField::Input::Textarea
        @field={{hash
          pk="test"
          answer=(hash
            value="Test Test Test"
          )
          question=(hash
            raw=(hash
              textareaMaxLength=200
            )
          )
        }}
      />
    `);

    assert.dom("textarea").hasClass("uk-textarea");
    assert.dom("textarea").hasAttribute("name", "test");
    assert.dom("textarea").hasAttribute("maxlength", "200");
    assert.dom("textarea").hasValue("Test Test Test");
  });

  test("it can be disabled", async function (assert) {
    assert.expect(2);

    await render(hbs`<CfField::Input::Textarea @disabled={{true}} />`);

    assert.dom("textarea").hasAttribute("readonly");
    assert.dom("textarea").hasClass("uk-disabled");
  });

  test("it triggers save on input", async function (assert) {
    assert.expect(1);

    this.set("save", (value) => assert.strictEqual(value, "Test"));

    await render(hbs`<CfField::Input::Textarea @onSave={{this.save}} />`);

    await fillIn("textarea", "Test");
  });
});
