import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { DateTime } from "luxon";
import { module, test } from "qunit";

module(
  "Integration | Component | inquiry-dialog/inquiry-deadline",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      const deadline = DateTime.now();

      this.inquiry = inquiry({ deadline: deadline.toISODate() });

      await render(
        hbs`<InquiryDialog::InquiryDeadline @inquiry={{this.inquiry}} />`
      );

      const formattedDate = this.owner
        .lookup("service:intl")
        .formatDate(deadline.toJSDate());

      assert.dom(".uk-text-muted").hasText(`Alarm ${formattedDate}`);
    });
  }
);
