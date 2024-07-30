import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | ca-report-list", function (hooks) {
  setupRenderingTest(hooks);

  test("it renders", async function (assert) {
    assert.expect(2);

    this.set("reports", [
      { slug: "test1", startingObject: "CASES" },
      { slug: "test2", startingObject: "CASES" },
    ]);

    this.set("itemRoute", "demo.builder");

    await render(
      hbs`<CaReportList @reports={{this.reports}} @itemRoute={{this.itemRoute}} />`,
      { owner: this.engine },
    );

    assert.dom(this.element).containsText("All reports");
    assert.dom("[data-test-report-list-item]").exists({ count: 2 });
  });
});
