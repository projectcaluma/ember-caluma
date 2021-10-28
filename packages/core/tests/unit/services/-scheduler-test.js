import { later } from "@ember/runloop";
import { settled } from "@ember/test-helpers";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | -scheduler", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (assert) {
    const calumaOptionsService = this.owner.lookup("service:caluma-options");

    calumaOptionsService.resolveGroups = function (ids) {
      assert.step("resolveGroups");
      return new Promise((resolve) =>
        later(() => resolve(ids.map((id) => ({ id, name: `Group ${id}` }))), 10)
      );
    };

    calumaOptionsService.resolveUsers = function (ids) {
      assert.step("resolveUsers");
      return new Promise((resolve) =>
        later(() => resolve(ids.map((id) => ({ id, name: `User ${id}` }))), 10)
      );
    };
  });

  test("it collects requested groups and only resolves them once", async function (assert) {
    assert.expect(4);

    const service = this.owner.lookup("service:-scheduler");

    service.resolveOnce(
      1,
      "group",
      (result) =>
        assert.step("groupCallback") &&
        assert.deepEqual(result, { id: 1, name: "Group 1" })
    );
    service.resolveOnce(
      2,
      "group",
      (result) =>
        assert.step("groupCallback") &&
        assert.deepEqual(result, { id: 2, name: "Group 2" })
    );

    await settled();

    assert.verifySteps(["resolveGroups", "groupCallback", "groupCallback"]);
  });

  test("it collects requested users and only resolves them once", async function (assert) {
    assert.expect(4);

    const service = this.owner.lookup("service:-scheduler");

    service.resolveOnce(
      1,
      "user",
      (result) =>
        assert.step("userCallback") &&
        assert.deepEqual(result, { id: 1, name: "User 1" })
    );
    service.resolveOnce(
      2,
      "user",
      (result) =>
        assert.step("userCallback") &&
        assert.deepEqual(result, { id: 2, name: "User 2" })
    );

    await settled();

    assert.verifySteps(["resolveUsers", "userCallback", "userCallback"]);
  });
});
