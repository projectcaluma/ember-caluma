import { setOwner } from "@ember/application";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";
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
            "q1-a1": "needs-interaction",
            "q1-a2": "negative",
            "q1-a3": "positive",
          },
          statusQuestion: "q1",
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
              status: "caluma.distribution.answer.buttons.confirm.status",
            },
            "revise-inquiry-answer": {
              color: "default",
              label: "caluma.distribution.answer.buttons.revise.label",
            },
          },
          infoQuestions: ["inquiry-answer-reason"],
          statusMapping: {
            "inquiry-answer-status-needs-interaction": "needs-interaction",
            "inquiry-answer-status-negative": "negative",
            "inquiry-answer-status-positive": "positive",
            "q1-a1": "needs-interaction",
            "q1-a2": "negative",
            "q1-a3": "positive",
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
