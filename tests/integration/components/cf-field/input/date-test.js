import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { click, render } from "@ember/test-helpers";
import moment from "moment";
import { hbs } from "ember-cli-htmlbars";
import { Interactor } from "ember-pikaday/test-support";
import ValidatorServiceStub from "dummy/tests/helpers/validator-service-stub";

module("Integration | Component | cf-field/input/date", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register("service:validator", ValidatorServiceStub);
  });

  test("it computes the proper element id", async function(assert) {
    await render(hbs`{{cf-field/input/date field=(hash pk="test-id")}}`);

    assert.dom("#test-id").exists();
  });

  test("it renders an input tag", async function(assert) {
    await render(hbs`{{cf-field/input/date}}`);
    assert.ok(this.element);
  });

  test("it triggers save when selecting a date", async function(assert) {
    const date_expected = new Date(2013, 3, 28);

    this.set("save", function(date_selected) {
      assert.deepEqual(
        date_selected,
        moment(date_expected).format("YYYY-MM-DD")
      );
    });

    await render(hbs`{{cf-field/input/date onSave=save}}`);

    await click("input");
    await Interactor.selectDate(date_expected);
  });
});
