import { assert } from "@ember/debug";
import { get } from "@ember/object";

import { createDecorator } from "@projectcaluma/ember-distribution/-private/decorator";
import { INQUIRY_STATUS } from "@projectcaluma/ember-distribution/config";

function decorator(
  target,
  key,
  desc,
  { inquiryProperty = "args.inquiry", inquiryTypeProperty = "args.type" } = {},
) {
  assert(
    `The @projectcaluma/ember-distribution config must be injected in order to use @inquiryStatus: \`@config config\``,
    Object.prototype.hasOwnProperty.call(target, "config"),
  );

  assert(
    `The intl service must be injected in order to use @inquiryStatus: \`@service intl\``,
    Object.prototype.hasOwnProperty.call(target, "intl"),
  );

  return {
    get() {
      const inquiry = get(this, inquiryProperty);
      const inquiryType = get(this, inquiryTypeProperty);
      const isAddressed = inquiryType === "addressed";
      const isControlling = inquiryType === "controlling";

      const isDraft = isAddressed
        ? inquiry.status === "READY"
        : inquiry.status === "SUSPENDED";
      const isSent = !isAddressed && inquiry.status === "READY";
      const isSkipped = inquiry.status === "SKIPPED";
      const isInProgress =
        (isAddressed || isControlling) &&
        inquiry.status === "READY" &&
        inquiry.childCase?.document?.modifiedContentAt;

      const buttonConfig = this.config.inquiry.answer.buttons;
      const inquiryAnswerStatus =
        buttonConfig &&
        (isAddressed || isControlling) &&
        inquiry.status === "READY"
          ? inquiry?.childCase?.workItems.edges
              .filter((edge) => edge.node.status === "READY")
              .map((edge) => {
                const config = buttonConfig[edge.node.task.slug]?.status;
                if (!config?.icon) {
                  return null;
                }

                return {
                  ...config,
                  label: this.intl.t(config.label),
                  color: config.color[inquiryType] ?? config.color,
                };
              })
              .filter(Boolean)[0]
          : null;

      if (inquiryAnswerStatus) {
        return inquiryAnswerStatus;
      }

      const answer = inquiry.childCase?.document.status.edges[0]?.node;
      const statusConfig = isSkipped
        ? INQUIRY_STATUS.SKIPPED
        : isInProgress
        ? INQUIRY_STATUS.IN_PROGRESS
        : isDraft
        ? INQUIRY_STATUS.DRAFT
        : isSent
        ? INQUIRY_STATUS.SENT
        : this.config.inquiry.answer.statusMapping[answer.value];

      return {
        slug: statusConfig.slug,
        label:
          !isSkipped && !isDraft && !isSent
            ? answer?.selectedOption.label
            : this.intl.t(`caluma.distribution.status.${statusConfig.slug}`),
        color: statusConfig.color[inquiryType] ?? statusConfig.color,
        icon: statusConfig.icon,
      };
    },
  };
}

export default createDecorator(decorator);
