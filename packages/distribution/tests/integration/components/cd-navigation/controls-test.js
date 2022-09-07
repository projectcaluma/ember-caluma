import { render, click } from "@ember/test-helpers";
import confirm from "dummy/tests/helpers/confirm";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import distribution from "@projectcaluma/ember-testing/scenarios/distribution";

module("Integration | Component | cd-navigation/controls", function (hooks) {
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
    Object.defineProperty(this.owner.lookup("service:distribution"), "caseId", {
      value: this.caseId,
    });
  });

  test("it renders", async function (assert) {
    await render(hbs`<CdNavigation::Controls @caseId={{this.caseId}} />`);

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

    await render(hbs`<CdNavigation::Controls @caseId={{this.case.id}} />`);

    await click("[data-test-send-pending-inquiries]");
    await confirm();

    workItems.reload();
    assert.true(
      workItems.models.every((workItem) => workItem.status === "READY")
    );
  });

  test("it can complete the current distribution", async function (assert) {
    await assert.expect(5);

    this.owner.lookup("service:caluma-options").distribution = {
      hooks: {
        postCompleteDistribution: () =>
          assert.step("post-complete-distribution"),
      },
    };

    const completeDistribution = this.server.schema.workItems.where({
      caseId: this.caseId,
      taskId: "complete-distribution",
    }).models[0];

    const readyWorkItems = this.server.schema.workItems.where({
      caseId: this.caseId,
      taskId: "inquiry",
      status: "READY",
    });
    const suspendedWorkItems = this.server.schema.workItems.where({
      caseId: this.caseId,
      taskId: "inquiry",
      status: "SUSPENDED",
    });

    await render(hbs`<CdNavigation::Controls @caseId={{this.caseId}} />`);

    await click("[data-test-complete-distribution]");
    await confirm();

    completeDistribution.reload();
    readyWorkItems.reload();
    suspendedWorkItems.reload();

    assert.true(completeDistribution.status === "COMPLETED");
    assert.true(
      readyWorkItems.models.every((workItem) => workItem.status === "SKIPPED")
    );

    assert.true(
      suspendedWorkItems.models.every(
        (workItem) => workItem.status === "CANCELED"
      )
    );

    assert.verifySteps(["post-complete-distribution"]);
  });

  test("it can reopen the current distribution", async function (assert) {
    await assert.expect(3);

    await render(hbs`<CdNavigation::Controls @caseId={{this.caseId}} />`);

    await click("[data-test-complete-distribution]");
    await confirm();

    assert.dom("[data-test-reopen-distribution]").exists();

    await click("[data-test-reopen-distribution]");
    await confirm();

    assert.dom("[data-test-complete-distribution]").exists();
    assert.dom("[data-test-new-inquiry]").exists();
  });
});
