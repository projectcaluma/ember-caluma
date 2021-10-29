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

    assert.deepEqual(cls.config, {
      inquiry: {
        answer: {
          infoQuestion: "inquiry-answer-reason",
          statusMapping: {
            "inquiry-answer-status-needs-interaction": "needs-interaction",
            "inquiry-answer-status-negative": "negative",
            "inquiry-answer-status-positive": "positive",
          },
          statusQuestion: "inquiry-answer-status",
        },
        deadlineQuestion: "inquiry-deadline",
        infoQuestion: "inquiry-remark",
        task: "inquiry",
      },
      warningPeriod: 3,
    });

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
      inquiry: {
        answer: {
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
      warningPeriod: 1,
    });
  });
});
