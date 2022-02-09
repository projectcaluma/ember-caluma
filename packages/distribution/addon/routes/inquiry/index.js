import Route from "@ember/routing/route";

export default class InquiryIndexRoute extends Route {
  model() {
    return {
      ...this.modelFor("inquiry"),
      case: this.modelFor("application"),
    };
  }
}
