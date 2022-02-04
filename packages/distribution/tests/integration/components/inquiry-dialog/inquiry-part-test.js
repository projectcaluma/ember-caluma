import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module(
  "Integration | Component | inquiry-dialog/inquiry-part",
  function (hooks) {
    setupRenderingTest(hooks);
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
        hbs`<InquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      const intl = this.owner.lookup("service:intl");
      const date = (value) => intl.formatDate(value.toJSDate());
      const time = (value) =>
        intl.formatTime(value.toJSDate(), {
          hour: "2-digit",
          minute: "2-digit",
        });

      assert.dom("p:nth-of-type(1)").containsText("controlling");
      assert
        .dom("ul.uk-subnav > li:nth-of-type(1)")
        .containsText(date(this.createdAt));
      assert
        .dom("ul.uk-subnav > li:nth-of-type(1)")
        .containsText(time(this.createdAt));
      assert.dom("p:nth-of-type(2)").hasText("Question?");

      this.set("type", "answer");

      assert.dom("p:nth-of-type(1)").containsText("addressed");
      assert
        .dom("ul.uk-subnav > li:nth-of-type(1)")
        .containsText(date(this.closedAt));
      assert
        .dom("ul.uk-subnav > li:nth-of-type(1)")
        .containsText(time(this.closedAt));
      assert.dom("p:nth-of-type(2)").hasText("Answer!");
    });

    test("it renders a link for editing the inquiry when permitted", async function (assert) {
      await render(
        hbs`<InquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      assert.dom("ul.uk-subnav > li:nth-of-type(2)").doesNotExist();

      this.owner.lookup("service:caluma-options").currentGroupId =
        "controlling";

      assert.dom("ul.uk-subnav > li:nth-of-type(2)").doesNotExist();

      await this.inquiry.setSuspended();

      assert
        .dom("ul.uk-subnav > li:nth-of-type(2)")
        .hasText("t:caluma.distribution.edit.link:()");
    });

    test("it renders a link for answering the inquiry when permitted", async function (assert) {
      await this.inquiry.setSuspended();

      await render(
        hbs`<InquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      assert.dom("ul.uk-subnav > li:nth-of-type(2)").doesNotExist();

      this.owner.lookup("service:caluma-options").currentGroupId = "addressed";

      assert.dom("ul.uk-subnav > li:nth-of-type(2)").doesNotExist();

      await this.inquiry.setReady();

      assert
        .dom("ul.uk-subnav > li:nth-of-type(2)")
        .hasText("t:caluma.distribution.answer.link:()");
    });
  }
);
