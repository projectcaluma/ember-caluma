import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

module(
  "Integration | Component | cd-inquiry-dialog/inquiry-deadline",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      const deadline = DateTime.now();

      this.inquiry = inquiry({ deadline: deadline.toISODate() });

      await render(
        hbs`<CdInquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`,
        { owner: this.engine },
      );

      const formattedDate = this.owner
        .lookup("service:intl")
        .formatDate(deadline.toJSDate());

      assert.dom(".uk-text-muted").hasText(formattedDate);
      assert.dom("[uk-icon]").hasAttribute("icon", "clock");
    });

    test("it renders withdrawn", async function (assert) {
      this.inquiry = inquiry({ workItemStatus: "CANCELED" });

      await render(
        hbs`<CdInquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`,
        { owner: this.engine },
      );

      assert.dom(".uk-text-muted").hasText("Withdrawn");
      assert.dom("[uk-icon]").hasAttribute("icon", "ban");
    });

    test("it renders skipped", async function (assert) {
      this.inquiry = inquiry({ workItemStatus: "SKIPPED" });

      await render(
        hbs`<CdInquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`,
        { owner: this.engine },
      );

      assert.dom(".uk-text-muted").hasText("Aborted");
      assert.dom("[uk-icon]").hasAttribute("icon", "lock");
    });
  },
);
