import { getOwner } from "@ember/application";
import merge from "lodash.merge";
import { cached } from "tracked-toolbox";

export const INQUIRY_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  POSITIVE: "positive",
  NEGATIVE: "negative",
  NEEDS_INTERACTION: "needs-interaction",
};

export default function config(target, property) {
  return cached(target, property, {
    get() {
      return merge(
        {
          controls: {
            createTask: "create-inquiry",
            completeTask: "complete-distribution",
          },
          warningPeriod: 3,
          inquiry: {
            task: "inquiry",
            deadlineQuestion: "inquiry-deadline",
            infoQuestion: "inquiry-remark",
            answer: {
              statusQuestion: "inquiry-answer-status",
              infoQuestion: "inquiry-answer-reason",
              statusMapping: {
                "inquiry-answer-status-positive": INQUIRY_STATUS.POSITIVE,
                "inquiry-answer-status-negative": INQUIRY_STATUS.NEGATIVE,
                "inquiry-answer-status-needs-interaction":
                  INQUIRY_STATUS.NEEDS_INTERACTION,
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
                  label:
                    "caluma.distribution.answer.release-adjustment-for-review",
                },
              },
            },
          },
          new: {
            defaultTypes: ["suggestions"],
            types: {
              suggestions: {
                label: "caluma.distribution.new.suggestions",
                icon: "bulb-outline",
                iconColor: "warning",
              },
            },
          },
        },
        getOwner(this).lookup("service:calumaOptions")?.distribution ?? {}
      );
    },
  });
}
