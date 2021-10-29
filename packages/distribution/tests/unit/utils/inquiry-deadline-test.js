import { setOwner } from "@ember/application";
import { tracked } from "@glimmer/tracking";
import inquiry from "dummy/tests/helpers/inquiry";
import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
import inquiryDeadline from "@projectcaluma/ember-distribution/utils/inquiry-deadline";

class MyClass {
  @config config;

  @tracked inquiry;

  @inquiryDeadline({ inquiryProperty: "inquiry" }) deadline;
}

module("Unit | Utility | inquiry-deadline", function (hooks) {
  setupTest(hooks);

  test("it works", async function (assert) {
    this.obj = new MyClass();
    this.obj.inquiry = inquiry();

    setOwner(this.obj, this.owner);

    assert.strictEqual(this.obj.deadline.color, "muted");
    assert.strictEqual(this.obj.deadline.isOverdue, false);
    assert.strictEqual(this.obj.deadline.isWarning, false);

    await this.obj.inquiry.setReady();

    assert.strictEqual(this.obj.deadline.color, "emphasis");
    assert.strictEqual(this.obj.deadline.isOverdue, false);
    assert.strictEqual(this.obj.deadline.isWarning, false);

    await this.obj.inquiry.setDeadline(moment.utc().add(2, "days").format());

    assert.strictEqual(this.obj.deadline.color, "warning");
    assert.strictEqual(this.obj.deadline.isOverdue, false);
    assert.strictEqual(this.obj.deadline.isWarning, true);

    await this.obj.inquiry.setDeadline(
      moment.utc().subtract(2, "days").format()
    );

    assert.strictEqual(this.obj.deadline.color, "danger");
    assert.strictEqual(this.obj.deadline.isOverdue, true);
    assert.strictEqual(this.obj.deadline.isWarning, true);
  });
});
