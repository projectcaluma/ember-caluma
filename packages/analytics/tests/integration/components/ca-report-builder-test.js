import { render } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupRenderingTest } from "dummy/tests/helpers";
import { Changeset } from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test, todo } from "qunit";

import AnalyticsTableValidations from "@projectcaluma/ember-analytics/validations/analytics-table";
import slugify from "@projectcaluma/ember-core/utils/slugify";

class AnalyticsTable {
  constructor({ name, startingObject } = {}) {
    this.name = name;
    this.startingObject = startingObject;
  }

  get slug() {
    return slugify(this.name ?? "");
  }
  @tracked name;
  @tracked startingObject;
}

module("Integration | Component | ca-report-builder", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function (assert) {
    this.set("startingObjects", [
      { label: "a", value: "A" },
      { label: "b", value: "B" },
    ]);
    this.set("onAdd", () => {
      assert.step("add");
    });
    this.set("route", "demo.analytics");
    this.set("slug", "test");
    this.set("analyticsTable", () => {
      return new Changeset(
        new AnalyticsTable({
          startingObject: "CASES",
        }),
        lookupValidator(AnalyticsTableValidations),
        AnalyticsTableValidations
      );
    });
  });

  test("it renders the table from slug", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @on-add={{this.onAdd}}
        @analyticsTable={{this.analyticsTable}}
      />`);

    assert.dom("[data-test-analytics-table]").exists();
  });

  todo("the form for creating new fields works", async function (assert) {
    await render(hbs`
      <CaReportBuilder
        @on-add={{this.onAdd}}
        @analyticsTable={{this.analyticsTable}}
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
