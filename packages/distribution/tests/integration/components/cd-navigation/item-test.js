import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

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
