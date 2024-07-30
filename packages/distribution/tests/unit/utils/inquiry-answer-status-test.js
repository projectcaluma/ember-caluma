import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
import inquiryAnswerStatus from "@projectcaluma/ember-distribution/utils/inquiry-answer-status";
import { setupTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

class MyClass {
  @service intl;
  @config config;
  @tracked inquiry;
  @inquiryAnswerStatus({ inquiryProperty: "inquiry" }) status;
}

module("Unit | Utility | inquiry-answer-status", function (hooks) {
  setupTest(hooks);

  test("it works", function (assert) {
    this.obj = new MyClass();
    this.obj.inquiry = inquiry();

    setOwner(this.obj, this.owner);

    assert.strictEqual(this.obj.status, "In review");

    this.obj.inquiry.setReadyChildWorkItem("adjust-inquiry-answer");

    assert.strictEqual(this.obj.status, "In revision");

    this.obj.inquiry.setReadyChildWorkItem("some-other-task");

    assert.strictEqual(this.obj.status, null);
  });
});
