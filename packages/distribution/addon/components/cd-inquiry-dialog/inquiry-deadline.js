import Component from "@glimmer/component";

import config from "@projectcaluma/ember-distribution/config";
import inquiryDeadline from "@projectcaluma/ember-distribution/utils/inquiry-deadline";

export default class CdInquiryDialogInquiryDeadlineComponent extends Component {
  @config config;

  @inquiryDeadline deadline;

  get icon() {
    if (this.isWithdrawn) {
      return "ban";
    } else if (this.isSkipped) {
      return "lock";
    }

    return "clock";
  }

  get isWithdrawn() {
    return this.args.inquiry.status === "CANCELED";
  }

  get isSkipped() {
    return this.args.inquiry.status === "SKIPPED";
  }
}
