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

  test("it renders the builder without existing table", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @slug="new"
        @on-add={{this.onAdd}}
        @starting-objects={{this.startingObjects}}
      />`);

    assert.dom("[data-test-analytics-table-new]").exists();
  });

  todo("it renders with existing table from slug", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @slug="new"
        @on-add={{this.onAdd}}
        @starting-objects={{this.startingObjects}}
      />`);

    assert.dom("[data-test-analytics-table-existing]").exists();
  });

  todo("the form for creating new fields works", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @slug="new"
        @on-add={{this.onAdd}}
        @starting-objects={{this.startingObjects}}
      />`);

    assert.dom("input[name=alias]").exists({ count: 1 });
    // assert.dom("input[name=alias]").("test");
    assert.dom("input[name=show]").isNotChecked();
    assert.dom("[data-test-selector-filter]").exists();
  });
  todo("it can delete analytics table", async function () {});
  todo("it can create new tables", async function () {});
  todo("it is possible to create new fields", async function () {});
  todo("it is not possible to create invalid fields", async function () {});
  todo(
    "the field object will reset after submitting a new field",
    async function () {}
  );
});
