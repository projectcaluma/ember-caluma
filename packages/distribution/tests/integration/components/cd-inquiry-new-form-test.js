import { render, click, fillIn } from "@ember/test-helpers";
import { hbs } from "ember-cli-htmlbars";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setFlatpickrDate } from "ember-flatpickr/test-support/helpers";
import { setupIntl } from "ember-intl/test-support";
import { DateTime } from "luxon";
import { module, test } from "qunit";

import {
  createBlueprint,
  createCase,
} from "@projectcaluma/ember-testing/scenarios/distribution";
import { setupRenderingTest } from "dummy/tests/helpers";

module("Integration | Component | cd-inquiry-new-form", function (hooks) {
  setupRenderingTest(hooks);
  setupIntl(hooks);
  setupMirage(hooks);

  hooks.beforeEach(async function () {
    createBlueprint(this.server);

    this.case = createCase(this.server, { group: { id: "1" } });

    this.selectedTypes = ["a"];
    this.search = "";

    this.owner.lookup("service:caluma-options").currentGroupId = 1;
    this.owner.lookup("service:caluma-options").distribution = {
      new: {
        types: {
          suggestions: { disabled: true },
          a: { label: "label-a" },
          b: { label: "label-b" },
        },
      },
    };
    this.owner.lookup("service:caluma-options").fetchTypedGroups = (
      types,
      search,
    ) => {
      const re = new RegExp(`.*${search}.*`, "i");

      const records = {
        a: [
          { id: 2, name: "2" },
          { id: 3, name: "3" },
        ],
        b: [
          { id: 4, name: "4" },
          { id: 5, name: "5" },
        ],
      };

      return Object.entries(records).reduce((retval, [type, recs]) => {
        if (!types.includes(type)) {
          return retval;
        }

        return { ...retval, [type]: recs.filter((rec) => re.test(rec.name)) };
      }, {});
    };

    const distribution = this.owner.lookup("service:distribution");

    distribution.caseId = this.case.id;
    await distribution.navigation;
  });

  test("it renders", async function (assert) {
    await render(hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`);

    assert.dom("button[data-test-type]").exists({ count: 2 });
    assert.dom("tr[data-test-group]").exists({ count: 2 });

    await click("button[data-test-type=b]");

    assert.deepEqual(this.selectedTypes, ["a", "b"]);
    assert.dom("tr[data-test-group]").exists({ count: 4 });

    await fillIn("input[data-test-search]", "2");

    assert.dom("tr[data-test-group]").exists({ count: 1 });
  });

  test("it can select and reset groups", async function (assert) {
    await render(hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`);

    assert.dom("ul[data-test-selected-groups]").doesNotExist();

    await click("tr[data-test-group='2']");
    await click("tr[data-test-group='3']");

    assert.dom("ul[data-test-selected-groups]").hasText("2 3");

    await click("button[data-test-reset]");

    assert.dom("ul[data-test-selected-groups]").doesNotExist();
  });

  test("it can create new inquiries", async function (assert) {
    this.owner.lookup("service:router").transitionTo = (routeName, model) => {
      assert.step("redirect");
      assert.strictEqual(routeName, "inquiry.detail.index");
      assert.deepEqual(model, { from: "1", to: "2" });
    };

    await render(hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`);

    await click("tr[data-test-group='2']");
    await click("tr[data-test-group='3']");

    await click("button[data-test-continue]");

    const intl = this.owner.lookup("service:intl");
    const date = DateTime.now().plus({ days: 30 });
    const expectedDeadline = intl.formatDate(date.toJSDate(), {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    assert
      .dom(`[name$="Question:inquiry-deadline"]`)
      .hasValue(date.toISODate());
    assert
      .dom(`[name$="Question:inquiry-deadline"] + input`)
      .hasValue(expectedDeadline);

    await fillIn('[name$="Question:inquiry-remark"]', "My remark");
    await setFlatpickrDate(
      '[name$="Question:inquiry-deadline"]',
      new Date(2022, 0, 1),
    );

    await click("button[data-test-submit]");

    assert.deepEqual(
      this.case.workItems.models
        .filter((w) => w.taskId === "inquiry")
        .map((w) => ({
          from: w.controllingGroups,
          to: w.addressedGroups,
          answers: w.document.answers.models.map((a) => ({
            question: a.questionId,
            value: a.value,
          })),
        })),
      [
        {
          from: ["1"],
          to: ["2"],
          answers: [
            {
              question: "inquiry-remark",
              value: "My remark",
            },
            {
              question: "inquiry-deadline",
              value: "2022-01-01",
            },
          ],
        },
        {
          from: ["1"],
          to: ["3"],
          answers: [
            {
              question: "inquiry-remark",
              value: "My remark",
            },
            {
              question: "inquiry-deadline",
              value: "2022-01-01",
            },
          ],
        },
      ],
    );

    assert.verifySteps(["redirect"]);
  });
});
