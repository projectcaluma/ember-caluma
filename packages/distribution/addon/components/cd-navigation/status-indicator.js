import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

import config from "@projectcaluma/ember-distribution/config";
import inquiryDeadline from "@projectcaluma/ember-distribution/utils/inquiry-deadline";
import inquiryStatus from "@projectcaluma/ember-distribution/utils/inquiry-status";

export default class CdNavigationStatusIndicatorComponent extends Component {
  @service intl;

  @config config;

  @inquiryStatus status;
  @inquiryDeadline deadline;

  get showDeadlineIndicator() {
    return (
      ["addressed", "controlling"].includes(this.args.type) &&
      (this.deadline.isOverdue || this.deadline.isWarning)
    );
  }
}
