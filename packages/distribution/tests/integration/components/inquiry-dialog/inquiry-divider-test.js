import { render } from "@ember/test-helpers";
import inquiry from "dummy/tests/helpers/inquiry";
import { hbs } from "ember-cli-htmlbars";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Integration | Component | inquiry-dialog/inquiry-divider",
  function (hooks) {
    setupRenderingTest(hooks);

    test("it renders", async function (assert) {
      const status = {
        value: "inquiry-answer-status-negative",
        label: "Negative",
      };

      this.inquiry = inquiry({ status });

      await render(
        hbs`<InquiryDialog::InquiryDivider @inquiry={{this.inquiry}} />`
      );

      assert.dom(".inquiry-divider.uk-text-danger").exists();
      assert
        .dom(".inquiry-divider.uk-text-danger svg title")
        .hasText("Negative");
    });
  }
);
