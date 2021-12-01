import { getOwner } from "@ember/application";
import merge from "lodash.merge";

export const INQUIRY_STATUS = {
  DRAFT: "draft",
  SENT: "sent",
  POSITIVE: "positive",
  NEGATIVE: "negative",
  NEEDS_INTERACTION: "needs-interaction",
};

export default function config() {
  return {
    get() {
      return merge(
        {
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
        },
        getOwner(this).lookup("service:calumaOptions")?.distribution ?? {}
      );
    },
  };
}
