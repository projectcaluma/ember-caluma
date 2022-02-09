import Route from "@ember/routing/route";

export default class InquiryRoute extends Route {
  model({ from, to }) {
    return { from, to };
  }
}
