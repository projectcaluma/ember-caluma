import { assert } from "@ember/debug";
import { get } from "@ember/object";
import { DateTime } from "luxon";

import { createDecorator } from "@projectcaluma/ember-distribution/-private/decorator";

function decorator(
  target,
  key,
  desc,
  { inquiryProperty = "args.inquiry" } = {}
) {
  assert(
    `The @projectcaluma/ember-distribution config must be injected in order to use @inquiryDeadline: \`@config config\``,
    Object.prototype.hasOwnProperty.call(target, "config")
  );

  return {
    get() {
      const inquiry = get(this, inquiryProperty);
      const value = inquiry.document?.deadline.edges[0]?.node.value;
      const isAnswered = inquiry.status === "COMPLETED";

      const deadline = DateTime.fromISO(value).startOf("day");
      const now = DateTime.now().startOf("day");

      const isOverdue = !isAnswered && now > deadline;
      const isWarning =
        !isAnswered && now.plus({ days: this.config.warningPeriod }) > deadline;

      return {
        value,
        isOverdue,
        isWarning,
        color: isAnswered
          ? "muted"
          : isOverdue
          ? "danger"
          : isWarning
          ? "warning"
          : "emphasis",
      };
    },
  };
}

export default createDecorator(decorator);
