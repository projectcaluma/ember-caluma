import { setOwner } from "@ember/application";
import { inject as service } from "@ember/service";
import { settled } from "@ember/test-helpers";
import { tracked } from "@glimmer/tracking";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
import inquiryStatus from "@projectcaluma/ember-distribution/utils/inquiry-status";
import { setupTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

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
      icon: "file-text",
      label: "Needs interaction",
      slug: "needs-interaction",
    });

    // extensible inquiry answer status
    this.obj.config.inquiry.answer = {
      ...this.obj.config.inquiry.answer,
      statusIconMap: { custom: "code" },
      statusColorMap: { custom: "primary" },
      statusMapping: {
        ...this.obj.config.inquiry.answer.statusMapping,
        "inquiry-answer-status-custom": "custom",
      },
    };

    await this.obj.inquiry.setStatus(
      "inquiry-answer-status-custom",
      "Custom answer status"
    );

    assert.deepEqual(this.obj.status, {
      color: "primary",
      icon: "code",
      label: "Custom answer status",
      slug: "custom",
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

    // In review
    this.set("obj.type", "controlling");

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "user",
      label: "t:caluma.distribution.answer.buttons.confirm.status:()",
    });

    this.set("obj.type", "addressed");

    assert.deepEqual(this.obj.status, {
      color: "muted",
      icon: "user",
      label: "t:caluma.distribution.answer.buttons.confirm.status:()",
    });

    this.set("obj.type", "more");

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "comment",
      label: "t:caluma.distribution.status.sent:()",
      slug: "sent",
    });

    // Sent
    this.obj.inquiry.childCase.workItems.edges = [];
    await settled();

    this.set("obj.type", "controlling");

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

    this.set("obj.type", "more");

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "comment",
      label: "t:caluma.distribution.status.sent:()",
      slug: "sent",
    });

    // In progress
    this.obj.inquiry.childCase.document.modifiedContentAt = new Date();
    await settled();

    this.set("obj.type", "controlling");

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "file-edit",
      label: "t:caluma.distribution.status.in-progress:()",
      slug: "in-progress",
    });

    this.set("obj.type", "addressed");

    assert.deepEqual(this.obj.status, {
      color: "muted",
      icon: "file-edit",
      label: "t:caluma.distribution.status.in-progress:()",
      slug: "in-progress",
    });

    this.set("obj.type", "more");

    assert.deepEqual(this.obj.status, {
      color: "emphasis",
      icon: "comment",
      label: "t:caluma.distribution.status.sent:()",
      slug: "sent",
    });
  });
});
