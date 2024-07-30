import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { module, test } from "qunit";

import { setupRenderingTest } from "dummy/tests/helpers";
import inquiry from "dummy/tests/helpers/inquiry";

module(
  "Integration | Component | cd-inquiry-dialog/inquiry-divider",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      const status = {
        value: "inquiry-answer-status-negative",
        label: "Negative",
      };

      this.inquiry = inquiry({ status });

      await render(
        hbs`<CdInquiryDialog::InquiryDivider @inquiry={{this.inquiry}} />`,
        { owner: this.engine },
      );

      assert.dom(".inquiry-divider.uk-text-danger").exists();

      assert.tooltipHasText(
        this.element,
        ".inquiry-divider.uk-text-danger [uk-icon]",
        "Negative",
      );
    });
  },
);
