import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cf-field/input/static", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    assert.expect(1);

    await render(hbs`<CfField::Input::Static
  @field={{hash
    pk="test"
    question=(hash
      __typename="StaticQuestion" raw=(hash staticContent="# Markdown")
    )
  }}
/>`);

    assert.dom("h1").hasText("Markdown");
  });
});
