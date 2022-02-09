import Route from "@ember/routing/route";

export default class InquiryDetailRoute extends Route {
  model({ inquiry }) {
    return inquiry;
  }
}
