import Route from "@ember/routing/route";

export default class DistributionInquiryDetailRoute extends Route {
  model({ inquiry }) {
    return inquiry;
  }
}
