import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { module, test, todo } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | ca-report-preview", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);

  test("it renders", async function (assert) {
    await render(hbs`<CaReportPreview />`);

    assert.dom(this.element).hasText("t:caluma.analytics.preview.export:()");
    assert.dom(this.element.querySelector("#reports-table")).exists();
  });

  todo("it renders table data", async function () {});
  todo("pivot table gets rendered", async function () {});
  todo("refreshing the table works", async function () {});
  todo("download is triggered", async function () {});
});
