import Route from "@ember/routing/route";

export default class InquiryDetailAnswerRoute extends Route {
  model() {
    return this.modelFor("inquiry.detail");
  }
}
