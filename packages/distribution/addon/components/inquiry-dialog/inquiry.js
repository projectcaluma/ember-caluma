import Component from "@glimmer/component";

export default class InquiryDialogInquiryComponent extends Component {
  get hasAnswer() {
    return this.args.inquiry.status === "COMPLETED";
  }
}
