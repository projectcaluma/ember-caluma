import { setOwner } from "@ember/application";
import { module, test } from "qunit";

import config, {
  INQUIRY_STATUS,
} from "@projectcaluma/ember-distribution/config";
import { setupTest } from "dummy/tests/helpers";

module("Unit | config", function (hooks) {
  setupTest(hooks);

  test("it deep merges default config with passed config", function (assert) {
    const cls = new (class {
      @config config;
    })();

    setOwner(cls, this.owner);

    this.owner.lookup("service:caluma-options").distribution = {
      warningPeriod: 1,
      inquiry: {
        answer: {
          statusMapping: {
            "q1-a1": INQUIRY_STATUS.NEEDS_INTERACTION,
            "q1-a2": INQUIRY_STATUS.NEGATIVE,
            "q1-a3": INQUIRY_STATUS.POSITIVE,
          },
          statusQuestion: "q1",
          details: null,
        },
      },
    };

    assert.deepEqual(cls.config, {
      controls: {
        completeTask: "complete-distribution",
        createTask: "create-inquiry",
        checkTask: "check-inquiries",
      },
      enableReminders: true,
      hooks: {},
      inquiry: {
        answer: {
          buttons: {
            "adjust-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.buttons.adjust.label",
              status: "caluma.distribution.answer.buttons.adjust.status",
            },
            "compose-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.buttons.compose.label",
              status: "caluma.distribution.answer.buttons.compose.status",
            },
            "confirm-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.buttons.confirm.label",
              status: {
                label: "caluma.distribution.answer.buttons.confirm.status",
                color: { addressed: "muted", controlling: "emphasis" },
                icon: "user",
              },
              willCompleteInquiry: true,
            },
            "revise-inquiry-answer": {
              color: "default",
              label: "caluma.distribution.answer.buttons.revise.label",
            },
          },
          infoQuestions: ["inquiry-answer-reason"],
          details: null,
          statusMapping: {
            "inquiry-answer-status-needs-interaction": {
              color: "warning",
              icon: "file-text",
              slug: "needs-interaction",
            },
            "inquiry-answer-status-negative": {
              color: "danger",
              icon: "close",
              slug: "negative",
            },
            "inquiry-answer-status-positive": {
              color: "success",
              icon: "check",
              slug: "positive",
            },
            "q1-a1": {
              color: "warning",
              icon: "file-text",
              slug: "needs-interaction",
            },
            "q1-a2": {
              color: "danger",
              icon: "close",
              slug: "negative",
            },
            "q1-a3": {
              color: "success",
              icon: "check",
              slug: "positive",
            },
          },
          statusQuestion: "q1",
        },
        deadlineQuestion: "inquiry-deadline",
        infoQuestion: "inquiry-remark",
        task: "inquiry",
      },
      new: {
        defaultDeadlineLeadTime: 30,
        defaultTypes: ["suggestions"],
        types: {
          suggestions: {
            icon: "star",
            iconColor: "warning",
            label: "caluma.distribution.new.suggestions",
          },
        },
      },
      permissions: {},
      ui: { small: false, stack: false, readonly: false },
      warningPeriod: 1,
    });
  });
});
