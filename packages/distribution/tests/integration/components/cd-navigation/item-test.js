import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | cd-navigation/item", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    this.type = "controlling";
    this.inquiry = inquiry();

    this.owner.lookup("service:router").isActive = () => true;

    await render(
      hbs`<CdNavigation::Item @inquiry={{this.inquiry}} @type={{this.type}} />`
    );

    assert.dom("li").hasClass("uk-active");
    assert.dom("li > a").containsText("addressed");
    assert.dom("li > a svg").exists();

    this.set("type", "more");
    assert.dom("li > a").containsText("addressed");

    this.set("type", "addressed");
    assert.dom("li > a").containsText("controlling");
  });
});
