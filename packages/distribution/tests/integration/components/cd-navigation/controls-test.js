import { render, click } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import distribution from "@projectcaluma/ember-testing/scenarios/distribution";
import { setupRenderingTest } from "dummy/tests/helpers";
import confirm from "dummy/tests/helpers/confirm";

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
    this.owner.lookup("service:distribution").caseId = this.caseId;
  });

  test("it renders", async function (assert) {
    await render(hbs`<CdNavigation::Controls />`);

    assert.dom("button").exists({ count: 3 });
    assert.dom("a").exists({ count: 1 });
  });

  test("it can send all pending inquiries", async function (assert) {
    const workItems = this.server.schema.workItems.where({
      caseId: this.caseId,
      taskId: "inquiry",
      status: "SUSPENDED",
      controllingGroups: ["group1"],
    });

    await render(hbs`<CdNavigation::Controls />`);

    await click("[data-test-send-pending-inquiries]");
    await confirm();

    workItems.reload();
    assert.true(
      workItems.models.every((workItem) => workItem.status === "READY")
    );
  });

  test("it can complete the current distribution", async function (assert) {
    assert.expect(5);

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

    await render(hbs`<CdNavigation::Controls />`);

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
    assert.expect(3);

    await render(hbs`<CdNavigation::Controls />`);

    await click("[data-test-complete-distribution]");
    await confirm();

    assert.dom("[data-test-reopen-distribution]").exists();

    await click("[data-test-reopen-distribution]");
    await confirm();

    assert.dom("[data-test-complete-distribution]").exists();
    assert.dom("[data-test-new-inquiry]").exists();
  });

  test("it can mark inquiries as checked", async function (assert) {
    assert.expect(1);

    await render(hbs`<CdNavigation::Controls />`);

    await click("[data-test-check-inquiries]");

    assert.dom("[data-test-check-inquiries]").doesNotExist();
  });
});
