import Component from "@glimmer/component";

import config from "@projectcaluma/ember-distribution/config";

export default class CdInquiryDialogInquiryComponent extends Component {
  @config config;

  get hasAnswer() {
    return this.args.inquiry.status === "COMPLETED";
  }
}
