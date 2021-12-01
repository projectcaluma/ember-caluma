import Route from "@ember/routing/route";

export default class DistributionInquiryDetailAnswerRoute extends Route {
  model() {
    return this.modelFor("distribution.inquiry.detail");
  }
}
