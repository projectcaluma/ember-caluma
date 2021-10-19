import { setOwner } from "@ember/application";
import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

import WorkItemModel from "@projectcaluma/ember-core/caluma-query/models/work-item";

const UUID = "96accc67-95d6-4e5d-82c6-20f3f4bc5942";

module("Unit | Caluma Query | Models | work-item", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    this.model = new WorkItemModel(
      Object.freeze({
        id: btoa(`WorkItem:${UUID}`),
        status: "COMPLETED",
        createdAt: "2021-10-10T00:00:00.000Z",
        closedAt: "2021-10-19T00:00:00.000Z",
        modifiedAt: "2021-10-11T00:00:00.000Z",
        deadline: "2021-10-20T00:00:00.000Z",
      })
    );
    setOwner(this.model, this.owner);
  });

  test("can read basic model values", function (assert) {
    assert.expect(6);

    assert.strictEqual(this.model.id, UUID);
    assert.strictEqual(
      this.model.status,
      "t:caluma.caluma-query.work-item.status.COMPLETED:()"
    );
    assert.ok(this.model.createdAt.isValid());
    assert.ok(this.model.closedAt.isValid());
    assert.ok(this.model.modifiedAt.isValid());
    assert.ok(this.model.deadline.isValid());
  });

  test("can write moment values", function (assert) {
    assert.expect(1);

    this.model.deadline = moment.utc("2022-01-01");
    assert.strictEqual(this.model.raw.deadline, "2022-01-01T00:00:00.000Z");
  });
});
