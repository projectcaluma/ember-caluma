import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";
import { stub } from "sinon";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cfb-navigation", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    stub(this.engine.lookup("service:router"), "currentRouteName").get(
      () => null,
    );

    await render(hbs`<CfbNavigation />`, { owner: this.engine });

    assert.dom("ul.uk-breadcrumb").exists();
  });
});
