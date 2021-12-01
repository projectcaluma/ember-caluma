import { render } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupIntl } from "ember-intl/test-support";
import { setupRenderingTest } from "ember-qunit";
import { module, test } from "qunit";

import {
  answerInquiry,
  confirmInquiry,
  createBlueprint,
  createInquiry,
  sendInquiry,
} from "@projectcaluma/ember-testing/scenarios/distribution";

module("Integration | Component | inquiry-dialog", function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);
  setupIntl(hooks);

  hooks.beforeEach(function () {
    createBlueprint(this.server);

    this.owner.lookup("service:caluma-options").currentGroupId = "group1";

    const distributionCase = this.server.create("case", {
      workflow: this.server.create("workflow", { slug: "distribution" }),
    });

    this.caseId = distributionCase.id;

    sendInquiry(this.server, {
      inquiry: createInquiry(this.server, distributionCase, {
        from: { id: "group1" },
        to: { id: "group2" },
      }),
    });
    confirmInquiry({
      inquiry: answerInquiry(this.server, {
        inquiry: createInquiry(this.server, distributionCase, {
          from: { id: "group1" },
          to: { id: "group2" },
        }),
      }),
    });
    confirmInquiry({
      inquiry: answerInquiry(this.server, {
        inquiry: createInquiry(this.server, distributionCase, {
          from: { id: "group1" },
          to: { id: "group2" },
        }),
      }),
    });
  });

  test("it renders", async function (assert) {
    await render(
      hbs`<InquiryDialog @from="group1" @to="group2" @caseId={{this.caseId}} />`
    );

    assert.dom("article").exists({ count: 3 });
    assert.dom(".inquiry-divider").exists({ count: 2 });
  });
});
