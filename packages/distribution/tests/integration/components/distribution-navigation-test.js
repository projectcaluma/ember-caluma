import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import distribution from "@projectcaluma/ember-testing/scenarios/distribution";

module("Integration | Component | distribution-navigation", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    const groups = [
      { id: "group1" },
      { id: "group2" },
      { id: "group3" },
      { id: "group4" },
      { id: "group5" },
    ];

    distribution(this.server, groups);

    this.caseId = this.server.db.cases[0].id;

    this.owner.lookup("service:caluma-options").currentGroupId = "group1";
    this.owner.lookup("service:router").isActive = () => true;
  });

  test("it renders navigation with 3 sections", async function (assert) {
    await render(hbs`<DistributionNavigation @caseId={{this.caseId}} />`);

    assert.dom("aside > ul").exists();
    assert.dom("aside > ul > li > ul").exists({ count: 3 });
    assert.dom("aside > ul > li > ul > li").exists({ count: 9 });

    assert
      .dom("aside > ul > li:nth-of-type(1) > a")
      .hasText("t:caluma.distribution.types.controlling:()");
    assert
      .dom("aside > ul > li:nth-of-type(2) > a")
      .hasText("t:caluma.distribution.types.addressed:()");
    assert
      .dom("aside > ul > li:nth-of-type(3) > a")
      .hasText("t:caluma.distribution.types.more:()");
  });
});
