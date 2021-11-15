import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
// import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test, todo } from "qunit";

module("Integration | Component | ca-report-builder", function (hooks) {
  setupRenderingTest(hooks);
  // setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.set("startingObjects", [
      { label: "a", value: "A" },
      { label: "b", value: "B" },
    ]);
    this.set("onAdd", (assert) => assert.step("add"));
    this.set("route", "demo.analytics");
    this.set("slug", "test");
  });

  test("it renders", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @slug="new"
        @on-add={{this.onAdd}}
        @starting-objects={{this.startingObjects}}
      />`);

    assert.dom("[data-test-analytics-table-new]").exists();
  });

  todo("it loads existing table from slug", async function (assert) {
    assert.dom("[data-test-analytics-table-existing]").exists();
  });
  todo("it can delete analytics table", async function () {});
  todo("it show ", async function () {});
});
