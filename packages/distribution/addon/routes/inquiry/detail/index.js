import Route from "@ember/routing/route";

export default class InquiryDetailIndexRoute extends Route {
  model() {
    return this.modelFor("inquiry.detail");
  }
}
