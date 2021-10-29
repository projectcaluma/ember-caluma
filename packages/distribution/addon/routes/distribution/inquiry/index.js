import Route from "@ember/routing/route";

export default class DistributionInquiryIndexRoute extends Route {
  model() {
    return {
      ...this.modelFor("distribution.inquiry"),
      case: this.modelFor("distribution"),
    };
  }
}
