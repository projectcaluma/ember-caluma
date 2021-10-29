import { assert } from "@ember/debug";
import { get } from "@ember/object";

import { createDecorator } from "@projectcaluma/ember-distribution/-private/decorator";
import { INQUIRY_STATUS } from "@projectcaluma/ember-distribution/config";

export const ICON_MAP = {
  [INQUIRY_STATUS.DRAFT]: "pencil-outline",
  [INQUIRY_STATUS.SENT]: "paper-plane-outline",
  [INQUIRY_STATUS.POSITIVE]: "checkmark-outline",
  [INQUIRY_STATUS.NEGATIVE]: "close-outline",
  [INQUIRY_STATUS.NEEDS_INTERACTION]: "repeat-outline",
};

export const COLOR_MAP = {
  [INQUIRY_STATUS.DRAFT]: "muted",
  [INQUIRY_STATUS.SENT]: "emphasis",
  [INQUIRY_STATUS.POSITIVE]: "success",
  [INQUIRY_STATUS.NEGATIVE]: "danger",
  [INQUIRY_STATUS.NEEDS_INTERACTION]: "warning",
};

function decorator(
  target,
  key,
  desc,
  { inquiryProperty = "args.inquiry", inquiryTypeProperty = "args.type" } = {}
) {
  assert(
    `The @projectcaluma/ember-distribution config must be injected in order to use @inquiryStatus: \`@config config\``,
    Object.prototype.hasOwnProperty.call(target, "config")
  );

  assert(
    `The intl service must be injected in order to use @inquiryStatus: \`@service intl\``,
    Object.prototype.hasOwnProperty.call(target, "intl")
  );

  return {
    get() {
      const inquiry = get(this, inquiryProperty);
      const isAddressed = get(this, inquiryTypeProperty) === "addressed";
      const isDraft = isAddressed
        ? inquiry.status === "READY"
        : inquiry.status === "SUSPENDED";
      const isSent = !isAddressed && inquiry.status === "READY";

      const answer = inquiry.childCase?.document.status.edges[0]?.node;
      const slug = isDraft
        ? INQUIRY_STATUS.DRAFT
        : isSent
        ? INQUIRY_STATUS.SENT
        : this.config.inquiry.answer.statusMapping[answer.value];

      return {
        slug,
        label:
          !isDraft && !isSent
            ? answer?.selectedOption.label
            : this.intl.t(`caluma.distribution.status.${slug}`),
        color: COLOR_MAP[slug],
        icon: ICON_MAP[slug],
      };
    },
  };
}

export default createDecorator(decorator);
