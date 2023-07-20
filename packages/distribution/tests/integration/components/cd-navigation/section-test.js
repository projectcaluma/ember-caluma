import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import {
  createBlueprint,
  createCase,
} from "@projectcaluma/ember-testing/scenarios/distribution";
import { setupRenderingTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

module("Integration | Component | cd-navigation/section", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    createBlueprint(this.server);

    this.case = createCase(this.server, { group: { id: "1" } });
    this.owner.lookup("service:caluma-options").currentGroupId = 1;
    this.owner.lookup("service:distribution").caseId = this.case.id;
  });

  test("it renders", async function (assert) {
    this.type = "controlling";

    const inquiries = [
      inquiry({
        addressedGroups: ["addressed1"],
        controllingGroups: ["controlling1"],
      }),
      inquiry({
        addressedGroups: ["addressed2"],
        controllingGroups: ["controlling2"],
      }),
      inquiry({
        addressedGroups: ["addressed3"],
        controllingGroups: ["controlling3"],
      }),
    ];

    Object.defineProperty(
      this.owner.lookup("service:distribution"),
      "inquiries",
      {
        value: {
          addressed: inquiries,
          controlling: inquiries,
          more: inquiries,
        },
      },
    );

    this.owner.lookup("service:router").isActive = () => true;

    await render(hbs`<CdNavigation::Section @type={{this.type}} />`);

    assert
      .dom("li:first-of-type > a")
      .hasText("t:caluma.distribution.types.controlling:()");
    assert.dom("ul > li:nth-of-type(1) > a").containsText("addressed1");
    assert.dom("ul > li:nth-of-type(2) > a").containsText("addressed2");
    assert.dom("ul > li:nth-of-type(3) > a").containsText("addressed3");

    this.set("type", "more");

    assert
      .dom("li:first-of-type > a")
      .hasText("t:caluma.distribution.types.more:()");
    assert.dom("ul > li:nth-of-type(1) > a").containsText("addressed1");
    assert.dom("ul > li:nth-of-type(2) > a").containsText("addressed2");
    assert.dom("ul > li:nth-of-type(3) > a").containsText("addressed3");

    this.set("type", "addressed");

    assert
      .dom("li:first-of-type > a")
      .hasText("t:caluma.distribution.types.addressed:()");
    assert.dom("ul > li:nth-of-type(1) > a").containsText("controlling1");
    assert.dom("ul > li:nth-of-type(2) > a").containsText("controlling2");
    assert.dom("ul > li:nth-of-type(3) > a").containsText("controlling3");
  });
});
