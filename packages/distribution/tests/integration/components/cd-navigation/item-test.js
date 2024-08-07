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
      hbs`<CdNavigation::Item @inquiry={{this.inquiry}} @type={{this.type}} />`,
      { owner: this.engine },
    );

    assert.dom("li").hasClass("uk-active");
    assert.dom("li > a").hasText("addressed");

    this.set("type", "more");
    assert.dom("li > a").hasText("addressed");

    this.set("type", "addressed");
    assert.dom("li > a").hasText("attn. controlling");
    assert
      .dom("li > a > span")
      .hasAttribute("title", "attention to controlling");
  });
});
