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
      warningPeriod: 1,
      inquiry: {
        task: "inquiry",
        deadlineQuestion: "inquiry-deadline",
        infoQuestion: "inquiry-remark",
        answer: {
          statusQuestion: "q1",
          infoQuestion: "inquiry-answer-reason",
          statusMapping: {
            "inquiry-answer-status-positive": "positive",
            "inquiry-answer-status-negative": "negative",
            "inquiry-answer-status-needs-interaction": "needs-interaction",
            "q1-a1": "needs-interaction",
            "q1-a2": "negative",
            "q1-a3": "positive",
          },
          buttons: {
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
            "adjust-inquiry-answer": {
              color: "primary",
              label: "caluma.distribution.answer.release-adjustment-for-review",
            },
          },
        },
      },
    });
  });
});
