import Route from "@ember/routing/route";

export default class EditQuestionsGeneralRoute extends Route {
  model() {
    return this.modelFor("edit");
  }
}
