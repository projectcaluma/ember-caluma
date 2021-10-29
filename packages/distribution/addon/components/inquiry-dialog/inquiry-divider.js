import { inject as service } from "@ember/service";
import Component from "@glimmer/component";

import config from "@projectcaluma/ember-distribution/config";
import inquiryStatus from "@projectcaluma/ember-distribution/utils/inquiry-status";

export default class InquiryDialogInquiryDividerComponent extends Component {
  @service intl;

  @config config;

  @inquiryStatus status;
}
