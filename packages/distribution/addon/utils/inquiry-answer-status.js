import { assert } from "@ember/debug";
import { get } from "@ember/object";

import { createDecorator } from "@projectcaluma/ember-distribution/-private/decorator";

function decorator(
  target,
  key,
  desc,
  { inquiryProperty = "args.inquiry" } = {},
) {
  assert(
    `The @projectcaluma/ember-distribution config must be injected in order to use @inquiryAnswerStatus: \`@config config\``,
    Object.prototype.hasOwnProperty.call(target, "config"),
  );

  return {
    get() {
      const inquiry = get(this, inquiryProperty);
      const readyWorkItems =
        inquiry.childCase?.workItems.edges
          .filter((edge) => edge.node.status === "READY")
          .map((edge) => edge.node.task.slug) ?? [];

      const buttonConfig = Object.entries(
        this.config.inquiry.answer.buttons,
      ).find(([task]) => readyWorkItems.includes(task))?.[1];

      return buttonConfig?.status
        ? this.intl.t(buttonConfig.status.label ?? buttonConfig.status)
        : null;
    },
  };
}

export default createDecorator(decorator);
