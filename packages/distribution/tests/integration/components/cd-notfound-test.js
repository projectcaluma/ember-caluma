import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-notfound", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<CdNotfound />`, { owner: this.engine });

    assert.dom("h1").hasText("404");
    assert.dom("h2").hasText("Page not found!");
    assert.dom("p").hasText("Go back to the landing page");
    assert.dom("p > a").hasText("landing page");
  });
});
