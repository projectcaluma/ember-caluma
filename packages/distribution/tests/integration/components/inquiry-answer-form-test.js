import { click, fillIn, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import {
  createBlueprint,
  createInquiry,
  sendInquiry,
} from "@projectcaluma/ember-testing/scenarios/distribution";

module("Integration | Component | inquiry-answer-form", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function (assert) {
    createBlueprint(this.server);

    this.owner.lookup("service:caluma-options").currentGroupId = "group1";

    const distributionCase = this.server.create("case", {
      workflow: this.server.create("workflow", { slug: "distribution" }),
    });

    this.inquiry = sendInquiry(this.server, {
      inquiry: createInquiry(this.server, distributionCase, {
        from: { id: "group2" },
        to: { id: "group1" },
      }),
    });

    this.owner.lookup("service:router").transitionTo = (routeName) => {
      assert.strictEqual(routeName, "distribution.inquiry.index");
      assert.step("transition");
    };
  });

  test("it renders an inquiry answer form with a button for each ready work item", async function (assert) {
    await render(hbs`<InquiryAnswerForm @inquiry={{this.inquiry.id}} />`);

    assert.dom("h1").hasText("t:caluma.distribution.answer.title:()");
    assert.dom("form").exists();
    assert
      .dom("button.uk-button-primary")
      .hasText("t:caluma.distribution.answer.release-for-review:()");
  });

  test("it renders the configured buttons for work items and completes them on click", async function (assert) {
    assert.expect(13);

    await render(hbs`<InquiryAnswerForm @inquiry={{this.inquiry.id}} />`);

    await click("input[value=inquiry-answer-status-positive]");
    await fillIn("textarea[name$=inquiry-answer-reason]", "Test");

    await click("button.uk-button-primary");
    assert.verifySteps(["transition"]);

    await click("button.uk-button-default");
    assert.verifySteps(["transition"]);

    await click("button.uk-button-primary");
    assert.verifySteps(["transition"]);

    await click("button.uk-button-primary");
    assert.verifySteps(["transition"]);

    assert.strictEqual(this.inquiry.status, "COMPLETED");
  });
});
