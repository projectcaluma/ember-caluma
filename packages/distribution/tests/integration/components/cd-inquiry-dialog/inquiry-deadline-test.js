import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module(
  "Integration | Component | cd-inquiry-dialog/inquiry-deadline",
  function (hooks) {
    setupRenderingTest(hooks);
    setupIntl(hooks);

    test("it renders", async function (assert) {
      const deadline = DateTime.now();

      this.inquiry = inquiry({ deadline: deadline.toISODate() });

      await render(
        hbs`<CdInquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`
      );

      const formattedDate = this.owner
        .lookup("service:intl")
        .formatDate(deadline.toJSDate());

      assert.dom(".uk-text-muted").hasText(`Alarm ${formattedDate}`);
    });

    test("it renders withdrawn", async function (assert) {
      this.inquiry = inquiry({ workItemStatus: "CANCELED" });

      await render(
        hbs`<CdInquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`
      );

      assert.dom("div").hasClass("uk-text-muted");
      assert
        .dom("div")
        .containsText("t:caluma.distribution.withdraw.status:()");
      assert.dom("svg title").hasText("Ban");
    });
  }
);
