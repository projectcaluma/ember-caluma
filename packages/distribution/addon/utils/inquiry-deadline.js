import { assert } from "@ember/debug";
import { get } from "@ember/object";
import moment from "moment";

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

      const deadline = moment.utc(value);
      const now = moment.utc();

      const isOverdue = !isAnswered && now.isAfter(deadline, "day");
      const isWarning =
        !isAnswered &&
        now.add(this.config.warningPeriod, "days").isAfter(deadline, "day");

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
