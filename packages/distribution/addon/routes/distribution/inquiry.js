import Route from "@ember/routing/route";

export default class DistributionInquiryRoute extends Route {
  model({ from, to }) {
    return { from, to };
  }
}
