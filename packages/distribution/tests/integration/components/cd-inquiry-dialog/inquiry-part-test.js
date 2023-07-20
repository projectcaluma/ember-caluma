import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";
import confirm from "dummy/tests/helpers/confirm";
import inquiry from "dummy/tests/helpers/inquiry";

module(
  "Integration | Component | cd-inquiry-dialog/inquiry-part",
  function (hooks) {
    setupRenderingTest(hooks);
    setupMirage(hooks);
    setupIntl(hooks);

    hooks.beforeEach(function () {
      this.createdAt = DateTime.fromObject({
        day: 1,
        month: 1,
        year: 2021,
        hour: 0,
        minute: 1,
      });

      this.closedAt = DateTime.fromObject({
        day: 1,
        month: 1,
        year: 2022,
        hour: 0,
        minute: 1,
      });

      this.inquiry = inquiry({
        remark: "Question?",
        reason: "Answer!",
        createdAt: this.createdAt.toISO(),
        closedAt: this.closedAt.toISO(),
      });

      this.type = "request";
    });

    test("it renders", async function (assert) {
      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`,
      );

      const intl = this.owner.lookup("service:intl");
      const date = (value) => intl.formatDate(value.toJSDate());
      const time = (value) =>
        intl.formatTime(value.toJSDate(), {
          hour: "2-digit",
          minute: "2-digit",
        });

      assert.dom("[data-test-title]").containsText("controlling");
      assert
        .dom("ul:nth-of-type(2).uk-subnav > li:nth-of-type(1)")
        .containsText(date(this.createdAt));
      assert
        .dom("ul:nth-of-type(2).uk-subnav > li:nth-of-type(1)")
        .containsText(time(this.createdAt));
      assert.dom("[data-test-inquiry-request]").hasText("Question?");

      this.set("type", "answer");

      assert.dom("[data-test-title]").containsText("addressed");
      assert
        .dom("ul:nth-of-type(2).uk-subnav > li:nth-of-type(1)")
        .containsText(date(this.closedAt));
      assert
        .dom("ul:nth-of-type(2).uk-subnav > li:nth-of-type(1)")
        .containsText(time(this.closedAt));
      assert.dom("[data-test-inquiry-answer]").hasText("Answer!");
    });

    test("it renders a link for editing the inquiry when permitted", async function (assert) {
      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`,
      );

      assert.dom("ul.uk-subnav > li > a[data-test-edit]").doesNotExist();
      assert.dom("ul.uk-subnav > li > a[data-test-details]").exists();

      this.owner.lookup("service:caluma-options").currentGroupId =
        "controlling";

      assert.dom("ul.uk-subnav > li > a[data-test-edit]").doesNotExist();
      assert.dom("ul.uk-subnav > li > a[data-test-details]").exists();

      await this.inquiry.setSuspended();

      assert
        .dom("ul.uk-subnav > li > a[data-test-edit]")
        .hasText("t:caluma.distribution.edit.link:()");
      assert.dom("ul.uk-subnav > li > a[data-test-details]").doesNotExist();
    });

    test("it renders a link for answering the inquiry when permitted", async function (assert) {
      await this.inquiry.setSuspended();

      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`,
      );

      assert.dom("ul.uk-subnav > li > a[data-test-answer]").doesNotExist();
      assert.dom("ul.uk-subnav > li > a[data-test-details]").exists();

      this.owner.lookup("service:caluma-options").currentGroupId = "addressed";

      assert.dom("ul.uk-subnav > li > a[data-test-answer]").doesNotExist();
      assert.dom("ul.uk-subnav > li > a[data-test-details]").exists();

      await this.inquiry.setReady();

      assert
        .dom("ul.uk-subnav > li > a[data-test-answer]")
        .hasText("t:caluma.distribution.answer.link:()");
      assert.dom("ul.uk-subnav > li > a[data-test-details]").exists();
    });

    test("it renders a case status if user can answer", async function (assert) {
      this.owner.lookup("service:caluma-options").currentGroupId = "addressed";

      await this.inquiry.setReady();

      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type="request" />`,
      );

      assert
        .dom("[data-test-title] .uk-label")
        .hasText("t:caluma.distribution.answer.buttons.confirm.status:()");

      await this.inquiry.setReadyChildWorkItem("some-task");

      assert.dom("[data-test-title] .uk-label").doesNotExist();

      await this.inquiry.setReadyChildWorkItem("adjust-inquiry-answer");

      assert
        .dom("[data-test-title] .uk-label")
        .hasText("t:caluma.distribution.answer.buttons.adjust.status:()");
    });

    test("it renders a link for sending a reminder for the inquiry when permitted", async function (assert) {
      assert.expect(3);

      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`,
      );

      await this.inquiry.setReady();

      assert.dom("[data-test-send-reminder]").doesNotExist();

      this.owner.lookup("service:caluma-options").currentGroupId =
        "controlling";

      assert.dom("[data-test-send-reminder]").doesNotExist();

      await this.inquiry.setDeadline(
        DateTime.now().minus({ days: 2 }).toISODate(),
      );

      assert
        .dom("[data-test-send-reminder]")
        .hasText("t:caluma.distribution.reminder.link:()");
    });

    test("it can send a reminder for an overdue inquiry", async function (assert) {
      assert.expect(2);

      await this.inquiry.setReady();
      const calumaOptions = this.owner.lookup("service:caluma-options");
      calumaOptions.currentGroupId = "controlling";
      calumaOptions.sendReminderDistributionInquiry = () => {
        assert.step("sendReminder");
      };
      await this.inquiry.setDeadline(
        DateTime.now().minus({ days: 2 }).toISODate(),
      );

      await render(
        hbs`<CdInquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`,
      );

      await click("[data-test-send-reminder]");
      await confirm();
      assert.verifySteps(["sendReminder"]);
    });
  },
);
