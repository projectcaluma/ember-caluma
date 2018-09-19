import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render, click } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

module("Integration | Component | cfb-button-group-select", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.set("options", [
      { value: 1, label: "Option 1" },
      { value: 2, label: "Option 2" },
      { value: 3, label: "Option 3" }
    ]);

    this.set("value", this.get("options")[0].value);
  });

  test("it renders", async function(assert) {
    await render(hbs`
      {{cfb-button-group-select
        value=value
        options=options
        optionLabelPath='label'
        optionTargetPath='value'
        update=(action (mut value))
      }}
    `);

    assert.dom(".uk-button-group").exists();
    assert.dom(".uk-button").exists({ count: 3 });
    assert.dom(".uk-button-primary").hasText("Option 1");
  });

  test("it can select", async function(assert) {
    await render(hbs`
      {{cfb-button-group-select
        value=value
        options=options
        optionLabelPath='label'
        optionTargetPath='value'
        update=(action (mut value))
      }}
    `);

    await click(".uk-button:last-of-type");

    assert.dom(".uk-button-group > .uk-button-primary").hasText("Option 3");
  });
});
