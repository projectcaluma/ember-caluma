import Route from "@ember/routing/route";

export default class DistributionInquiryDetailIndexRoute extends Route {
  model() {
    return this.modelFor("distribution.inquiry.detail");
  }
}
