import { setOwner } from "@ember/application";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

import config from "@projectcaluma/ember-distribution/config";

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
      },
      inquiry: {
        answer: {
          buttons: {
            "adjust-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.release-adjustment-for-review",
            },
            "compose-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.release-for-review",
            },
            "confirm-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.confirm",
            },
            "revise-inquiry-answer": {
              color: "default",
              label: "caluma.distribution.answer.revise",
            },
          },
          infoQuestion: "inquiry-answer-reason",
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
        defaultTypes: ["suggestions"],
        types: {
          suggestions: {
            icon: "bulb-outline",
            iconColor: "warning",
            label: "caluma.distribution.new.suggestions",
          },
        },
      },
      warningPeriod: 1,
    });
  });
});
