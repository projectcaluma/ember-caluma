import { setupMirage } from "ember-cli-mirage/test-support";
import { module, test } from "qunit";

import { setupTest } from "dummy/tests/helpers";

module("Unit | Ability | inquiry", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    this.owner.lookup("service:caluma-options").currentGroupId = 1;
  });

  test("it respects configured custom permissions", async function (assert) {
    assert.expect(4);

    const ability = this.owner.lookup("ability:inquiry");

    ability.task = "test-task";

    this.owner.lookup("service:caluma-options").distribution = {
      permissions: {
        sendInquiry: () => false,
        withdrawInquiry: () => false,
        completeInquiryChildWorkItem: (_, task) => {
          assert.strictEqual(task, "test-task");
          return false;
        },
      },
    };

    assert.false(ability.canSend);
    assert.false(ability.canWithdraw);
    assert.false(ability.canCompleteChildWorkItem);
  });
});
