import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

module("Unit | Ability | inquiry", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.owner.lookup("service:caluma-options").currentGroupId = "controlling";
  });

  test("it respects configured custom permissions", async function (assert) {
    assert.expect(8);

    const ability = this.owner.lookup("ability:inquiry");

    ability.task = "test-task";
    ability.model = inquiry();

    this.owner.lookup("service:caluma-options").distribution = {
      permissions: {
        sendInquiry: () => {
          assert.step("send-inquiry");
          return false;
        },
        withdrawInquiry: () => {
          assert.step("withdraw-inquiry");
          return false;
        },
        completeInquiryChildWorkItem: (_, task) => {
          assert.step("complete-inquiry-child-work-item");
          assert.strictEqual(task, "test-task");
          return false;
        },
      },
    };

    await ability.model.setSuspended();
    assert.false(ability.canSend);
    assert.false(ability.canWithdraw);
    await ability.model.setReady();
    assert.false(ability.canCompleteChildWorkItem);

    assert.verifySteps([
      "send-inquiry",
      "withdraw-inquiry",
      "complete-inquiry-child-work-item",
    ]);
  });
});
