import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/errors", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    await render(
      hbs`<CfField::Errors @field={{hash errors=(array "foo" "bar")}} />`,
    );

    assert.dom().hasText("foo, bar");
  });
});
