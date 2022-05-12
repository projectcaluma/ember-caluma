import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import inquiry from "dummy/tests/helpers/inquiry";
import { setupIntl } from "ember-intl/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
import inquiryStatus from "@projectcaluma/ember-distribution/utils/inquiry-status";

class MyClass {
  @service intl;

  @config config;

  @tracked type = "controlling";
  @tracked inquiry;

  @inquiryStatus({ inquiryProperty: "inquiry", inquiryTypeProperty: "type" })
  status;
}

module("Unit | Utility | inquiry-status", function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  test("it works", async function (assert) {
    this.obj = new MyClass();
    this.obj.inquiry = inquiry();

    setOwner(this.obj, this.owner);

    assert.deepEqual(this.obj.status, {
      color: "success",
      icon: "check",
      label: "Positive",
      slug: "positive",
    });

    await this.obj.inquiry.setStatus(
      "inquiry-answer-status-negative",
      "Negative"
    );

    assert.deepEqual(this.obj.status, {
      color: "danger",
      icon: "close",
      label: "Negative",
      slug: "negative",
    });

    await this.obj.inquiry.setStatus(
      "inquiry-answer-status-needs-interaction",
      "Needs interaction"
    );

    assert.deepEqual(this.obj.status, {
      color: "warning",
      icon: "refresh",
      label: "Needs interaction",
      slug: "needs-interaction",
    });

    await this.obj.inquiry.setSuspended();

    assert.deepEqual(this.obj.status, {
      color: "muted",
      icon: "commenting",
      label: "t:caluma.distribution.status.draft:()",
      slug: "draft",
    });

    await this.obj.inquiry.setSkipped();

    assert.deepEqual(this.obj.status, {
      color: "muted",
      icon: "lock",
      label: "t:caluma.distribution.status.skipped:()",
      slug: "skipped",
    });

    await this.obj.inquiry.setReady();

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "comment",
      label: "t:caluma.distribution.status.sent:()",
      slug: "sent",
    });

    this.set("obj.type", "addressed");

    assert.deepEqual(this.obj.status, {
      color: "muted",
      icon: "commenting",
      label: "t:caluma.distribution.status.draft:()",
      slug: "draft",
    });
  });
});
