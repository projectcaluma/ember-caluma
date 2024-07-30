import { setOwner } from "@ember/application";
import { module, test } from "qunit";

import WorkItemModel from "@projectcaluma/ember-core/caluma-query/models/work-item";
import { setupTest } from "dummy/tests/helpers";

const UUID = "96accc67-95d6-4e5d-82c6-20f3f4bc5942";

module("Unit | Caluma Query | Models | work-item", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    this.model = new WorkItemModel(
      Object.freeze({
        id: btoa(`WorkItem:${UUID}`),
        status: "COMPLETED",
        createdAt: "2021-10-10T00:00:00.000Z",
        closedAt: "2021-10-19T00:00:00.000Z",
        modifiedAt: "2021-10-11T00:00:00.000Z",
        deadline: "2021-10-20T00:00:00.000Z",
      }),
    );
    setOwner(this.model, this.owner);
  });

  test("can read basic model values", function (assert) {
    assert.expect(10);

    assert.strictEqual(this.model.id, UUID);
    assert.strictEqual(this.model.status, "Completed");

    ["createdAt", "closedAt", "modifiedAt", "deadline"].forEach((attr) => {
      assert.true(this.model[attr] instanceof Date);
      assert.false(isNaN(this.model[attr]));
    });
  });

  test("can write date values", function (assert) {
    assert.expect(1);

    this.model.deadline = new Date(Date.UTC(2022, 0, 1));
    assert.strictEqual(this.model.raw.deadline, "2022-01-01T00:00:00.000Z");
  });
});
