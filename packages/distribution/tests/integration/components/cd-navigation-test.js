import { render, waitUntil } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import distribution from "@projectcaluma/ember-testing/scenarios/distribution";
import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-navigation", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    const distributionCase = distribution(this.server, [
      { id: "group1" },
      { id: "group2" },
      { id: "group3" },
      { id: "group4" },
      { id: "group5" },
    ]);

    this.caseId = distributionCase.id;

    this.owner.lookup("service:caluma-options").currentGroupId = "group1";
    this.owner.lookup("service:router").isActive = () => true;
    this.owner.lookup("service:distribution").caseId = this.caseId;
  });

  test("it renders navigation with 3 sections", async function (assert) {
    await render(hbs`<CdNavigation />`);

    await waitUntil(
      () => this.owner.lookup("service:distribution").navigation.isFinished,
    );

    assert.dom("ul:first-child").exists({ count: 1 });
    assert.dom("ul:first-child > li > ul").exists({ count: 3 });
    assert.dom("ul:first-child > li > ul > li").exists({ count: 9 });

    assert
      .dom("ul:first-child > li:nth-of-type(2) > a")
      .hasText("t:caluma.distribution.types.addressed:()");
    assert
      .dom("ul:first-child > li:nth-of-type(3) > a")
      .hasText("t:caluma.distribution.types.controlling:()");
    assert
      .dom("ul:first-child > li:nth-of-type(4) > a")
      .hasText("t:caluma.distribution.types.more:()");
  });
});
