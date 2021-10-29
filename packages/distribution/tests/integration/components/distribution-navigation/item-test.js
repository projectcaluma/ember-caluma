import Service from "@ember/service";
import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | distribution-navigation/item",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      this.type = "controlling";
      this.isActive = false;
      this.inquiry = inquiry();

      this.owner.register(
        "service:router",
        class extends Service {
          isActive() {
            return this.isActive;
          }
        }
      );

      await render(
        hbs`<DistributionNavigation::Item @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      assert.dom("li > a").containsText("addressed");
      assert.dom("li > a svg").exists();

      this.set("type", "more");
      assert.dom("li > a").containsText("addressed");

      this.set("type", "addressed");
      assert.dom("li > a").containsText("controlling");

      this.set("isActive", true);
      assert.dom("li").hasClass("uk-active");
    });
  }
);
