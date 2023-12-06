import { assert } from "@ember/debug";
import { get } from "@ember/object";
import { DateTime } from "luxon";

import { createDecorator } from "@projectcaluma/ember-distribution/-private/decorator";

function decorator(
  target,
  key,
  desc,
  { inquiryProperty = "args.inquiry" } = {},
) {
  assert(
    `The @projectcaluma/ember-distribution config must be injected in order to use @inquiryDeadline: \`@config config\``,
    Object.prototype.hasOwnProperty.call(target, "config"),
  );

  return {
    get() {
      const inquiry = get(this, inquiryProperty);
      const value = inquiry.document?.deadline.edges[0]?.node.value;
      const isDone = ["COMPLETED", "SKIPPED", "CANCELED"].includes(
        inquiry.status,
      );

      const diff = DateTime.fromISO(value).diffNow("days").days;

      const isOverdue = !isDone && diff <= 0;
      const isWarning = !isDone && diff <= this.config.warningPeriod;

      return {
        value,
        isOverdue,
        isWarning,
        color: isDone
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
