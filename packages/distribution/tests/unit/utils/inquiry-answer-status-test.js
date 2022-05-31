import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import inquiry from "dummy/tests/helpers/inquiry";
import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
import inquiryAnswerStatus from "@projectcaluma/ember-distribution/utils/inquiry-answer-status";

class MyClass {
  @service intl;
  @config config;
  @tracked inquiry;
  @inquiryAnswerStatus({ inquiryProperty: "inquiry" }) status;
}

module("Unit | Utility | inquiry-answer-status", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  test("it works", function (assert) {
    this.obj = new MyClass();
    this.obj.inquiry = inquiry();

    setOwner(this.obj, this.owner);

    assert.strictEqual(
      this.obj.status,
      "t:caluma.distribution.answer.buttons.confirm.status:()"
    );

    this.obj.inquiry.setReadyChildWorkItem("adjust-inquiry-answer");

    assert.strictEqual(
      this.obj.status,
      "t:caluma.distribution.answer.buttons.adjust.status:()"
    );

    this.obj.inquiry.setReadyChildWorkItem("some-other-task");

    assert.strictEqual(this.obj.status, null);
  });
});
