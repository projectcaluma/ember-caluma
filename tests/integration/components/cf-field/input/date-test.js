import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import { Interactor } from "ember-pikaday/test-support";

module("Integration | Component | cf-field/input/date", function(hooks) {
  setupRenderingTest(hooks);

  test("it renders an input tag", async function(assert) {
    await render(hbs`
      {{pikaday-input}}
    `);

    assert.dom("input").exists();
  });

  test("selecting a date should send an action", async function(assert) {
    const expectedDate = new Date(2013, 3, 28);

    this.set("onSelection", function(selectedDate) {
      assert.deepEqual(selectedDate, expectedDate);
    });

    await render(hbs`
      {{pikaday-input onSelection=(action onSelection)}}
    `);

    await click("input");
    await Interactor.selectDate(expectedDate);
  });
});
