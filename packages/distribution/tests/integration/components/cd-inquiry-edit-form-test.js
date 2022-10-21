import { click, render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { module, test } from "qunit";

import {
  createBlueprint,
  createInquiry,
} from "@projectcaluma/ember-testing/scenarios/distribution";
import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-inquiry-edit-form", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    createBlueprint(this.server);

    this.owner.lookup("service:caluma-options").currentGroupId = "group1";

    const distributionCase = this.server.create("case", {
      workflow: this.server.create("workflow", { slug: "distribution" }),
    });

    this.inquiry = createInquiry(this.server, distributionCase, {
      from: { id: "group1" },
      to: { id: "group2" },
    });
  });

  test("it renders an inquiry form with a send button", async function (assert) {
    await render(hbs`<CdInquiryEditForm @inquiry={{this.inquiry.id}} />`);

    assert
      .dom("[data-test-document-header]")
      .hasText("Inquiry (group2) t:caluma.distribution.status.draft:()");
    assert.dom("form").exists();
    assert
      .dom("button.uk-button-primary")
      .hasText("t:caluma.distribution.edit.send:()");
  });

  test("it resumes the work item on send", async function (assert) {
    assert.expect(4);

    this.owner.lookup("service:router").transitionTo = (routeName) => {
      assert.strictEqual(routeName, "inquiry.index");
      assert.step("transition");
    };

    await render(hbs`<CdInquiryEditForm @inquiry={{this.inquiry.id}} />`);

    await click("button.uk-button-primary");

    assert.verifySteps(["transition"]);
    assert.strictEqual(this.inquiry.status, "READY");
  });
});
