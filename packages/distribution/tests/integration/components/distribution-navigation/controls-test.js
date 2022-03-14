import { render, click } from "@ember/test-helpers";
import confirm from "dummy/tests/helpers/confirm";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import distribution from "@projectcaluma/ember-testing/scenarios/distribution";

module(
  "Integration | Component | distribution-navigation/controls",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);

    hooks.beforeEach(function () {
      distribution(this.server, [
        { id: "group1" },
        { id: "group2" },
        { id: "group3" },
        { id: "group4" },
        { id: "group5" },
      ]);

      this.caseId = this.server.db.cases[0].id;
      this.owner.lookup("service:caluma-options").currentGroupId = "group1";
      Object.defineProperty(
        this.owner.lookup("service:distribution"),
        "caseId",
        {
          value: this.caseId,
        }
      );
    });

    test("it renders", async function (assert) {
      await render(
        hbs`<DistributionNavigation::Controls @caseId={{this.caseId}} />`
      );

      assert.dom("button").exists({ count: 2 });
      assert.dom("a").exists({ count: 1 });
    });

    test("it can send all pending inquiries", async function (assert) {
      const workItems = this.server.schema.workItems.where({
        caseId: this.caseId,
        taskId: "inquiry",
        status: "SUSPENDED",
        controllingGroups: ["group1"],
      });

      await render(
        hbs`<DistributionNavigation::Controls @caseId={{this.case.id}} />`
      );

      await click("[data-test-send-pending-inquiries]");
      await confirm();

      workItems.reload();
      assert.true(
        workItems.models.every((workItem) => workItem.status === "READY")
      );
    });
  }
);
