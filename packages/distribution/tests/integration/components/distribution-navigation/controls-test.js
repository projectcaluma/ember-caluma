import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import {
  createBlueprint,
  createCase,
} from "@projectcaluma/ember-testing/scenarios/distribution";

module(
  "Integration | Component | distribution-navigation/controls",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
      createBlueprint(this.server);

      this.case = createCase(this.server, { group: { id: "1" } });
      this.owner.lookup("service:caluma-options").currentGroupId = 1;
    });

    test("it renders", async function (assert) {
      await render(
        hbs`<DistributionNavigation::Controls @caseId={{this.case.id}} />`
      );

      assert.dom("a[uk-icon=plus]").exists();
      assert.dom("button").exists({ count: 2 });
    });

    test("it doesn't render a create link if no assigned work item exists", async function (assert) {
      this.server.schema.workItems
        .findBy({ taskId: "create-inquiry" })
        .destroy();

      await render(
        hbs`<DistributionNavigation::Controls @caseId={{this.case.id}} />`
      );

      assert.dom("a[uk-icon=plus]").doesNotExist();
    });

    test("it doesn't render a complete button if no assigned work item exists", async function (assert) {
      this.server.schema.workItems
        .findBy({ taskId: "complete-distribution" })
        .destroy();

      await render(
        hbs`<DistributionNavigation::Controls @caseId={{this.case.id}} />`
      );

      assert.dom("button").exists({ count: 1 });
    });
  }
);
