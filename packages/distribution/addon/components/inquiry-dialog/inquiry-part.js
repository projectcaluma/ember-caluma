import Component from "@glimmer/component";

export default class InquiryDialogInquiryPartComponent extends Component {
  get date() {
    const key = this.args.type === "request" ? "createdAt" : "closedAt";

    return this.args.inquiry[key];
  }

  get info() {
    const document =
      this.args.type === "request"
        ? this.args.inquiry.document
        : this.args.type === "answer"
        ? this.args.inquiry.childCase.document
        : null;

    return document.info.edges[0]?.node.value;
  }
}
