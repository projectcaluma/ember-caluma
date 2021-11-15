import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module("Integration | Component | ca-report-preview", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<CaReportPreview />`);

    assert
      .dom(this.element)
      .hasText("t:caluma.analytics.sections.table_preview:()");
  });
});
