import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module(
  "Integration | Component | inquiry-dialog/inquiry-part",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      const createdAt = moment.utc({
        day: 1,
        month: 0,
        year: 2021,
        hour: 0,
        minute: 1,
      });

      const closedAt = moment.utc({
        day: 1,
        month: 0,
        year: 2022,
        hour: 0,
        minute: 1,
      });

      this.inquiry = inquiry({
        remark: "Question?",
        reason: "Answer!",
        createdAt: createdAt.format(),
        closedAt: closedAt.format(),
      });
      this.type = "request";

      await render(
        hbs`<InquiryDialog::InquiryPart @inquiry={{this.inquiry}} @type={{this.type}} />`
      );

      const intl = this.owner.lookup("service:intl");
      const date = (value) => intl.formatDate(value);
      const time = (value) =>
        intl.formatTime(value, { hour: "2-digit", minute: "2-digit" });

      assert.dom("p:nth-of-type(1)").containsText("controlling");
      assert.dom("ul.uk-subnav > li").containsText(date(createdAt));
      assert.dom("ul.uk-subnav > li").containsText(time(createdAt));
      assert.dom("p:nth-of-type(2)").hasText("Question?");

      this.set("type", "answer");

      assert.dom("p:nth-of-type(1)").containsText("addressed");
      assert.dom("ul.uk-subnav > li").containsText(date(closedAt));
      assert.dom("ul.uk-subnav > li").containsText(time(closedAt));
      assert.dom("p:nth-of-type(2)").hasText("Answer!");
    });
  }
);
