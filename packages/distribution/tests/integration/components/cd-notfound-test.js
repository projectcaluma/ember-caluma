import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-notfound", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<CdNotfound />`);

    assert.dom("h1").hasText("t:caluma.distribution.notfound.title:()");
    assert.dom("h2").hasText("t:caluma.distribution.notfound.subtitle:()");
    assert
      .dom("p")
      .hasText(
        "t:caluma.distribution.notfound.back:() t:caluma.distribution.notfound.link:()",
      );
    assert.dom("p > a").hasText("t:caluma.distribution.notfound.link:()");
  });
});
