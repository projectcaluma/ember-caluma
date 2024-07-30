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
          suggestions: {
            label: "suggestions",
            disabled: true,
          },
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

    const distribution = this.engine.lookup("service:distribution");

    distribution.caseId = this.case.id;
    await distribution.navigation;
  });

  test("it renders", async function (assert) {
    await render(
      hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`,
      { owner: this.engine },
    );

    assert.dom("button[data-test-type]").exists({ count: 2 });
    assert.dom("tr[data-test-group]").exists({ count: 2 });

    await click("button[data-test-type=b]");

    assert.deepEqual(this.selectedTypes, ["a", "b"]);
    assert.dom("tr[data-test-group]").exists({ count: 4 });

    await fillIn("input[data-test-search]", "2");

    assert.dom("tr[data-test-group]").exists({ count: 1 });
  });

  test("it can select and reset groups", async function (assert) {
    await render(
      hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`,
      { owner: this.engine },
    );

    assert.dom("ul[data-test-selected-groups]").doesNotExist();

    await click("tr[data-test-group='2']");
    await click("tr[data-test-group='3']");

    assert.dom("ul[data-test-selected-groups]").hasText("2 3");

    await click("button[data-test-reset]");

    assert.dom("ul[data-test-selected-groups]").doesNotExist();
  });

  test("it can create new inquiries", async function (assert) {
    this.engine.lookup("service:router").transitionTo = (routeName, model) => {
      assert.step("redirect");
      assert.strictEqual(routeName, "inquiry.detail.index");
      assert.deepEqual(model, { from: "1", to: "2" });
    };

    await render(
      hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`,
      { owner: this.engine },
    );

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

  module("when showAllGroups is on", function (hooks) {
    hooks.beforeEach(async function () {
      const calumaOptions = this.owner.lookup("service:caluma-options");
      calumaOptions.distribution.ui = {
        ...calumaOptions.distribution?.ui,
        new: {
          ...calumaOptions.distribution?.ui?.new,
          showAllServices: true,
        },
      };

      await render(
        hbs`<CdInquiryNewForm
  @selectedTypes={{this.selectedTypes}}
  @search={{this.search}}
  @onChangeSelectedTypes={{fn (mut this.selectedTypes)}}
  @onChangeSearch={{fn (mut this.search)}}
/>`,
        { owner: this.engine },
      );
    });

    test("it doesn't show the group buttons", async function (assert) {
      assert.dom("[data-test-group-toggle-bar]").isNotVisible();
    });

    test("it shows all the enabled groups", async function (assert) {
      assert.dom('[data-test-group-type="suggestions"]').isNotVisible();
      assert.dom('[data-test-group-type="label-a"]').isVisible();
      assert.dom('[data-test-group-type="label-b"]').isVisible();
    });

    test("it allows the toggling of a group", async function (assert) {
      assert.dom('[data-test-group="2"]').isVisible();
      assert.dom('[data-test-group="3"]').isVisible();

      await click('[data-test-group-type="label-a"]');

      assert.dom('[data-test-group="2"]').isNotVisible();
      assert.dom('[data-test-group="3"]').isNotVisible();
    });

    test("it allows searching for a group and shows all the groups", async function (assert) {
      await click('[data-test-group-type="label-a"]'); // hide the first group

      await fillIn("[data-test-search]", "2");

      assert.dom('[data-test-group="2"]').isVisible();
      assert.dom('[data-test-group="3"]').isNotVisible();
    });
  });
});
