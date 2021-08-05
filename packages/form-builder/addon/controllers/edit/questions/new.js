import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class EditQuestionsNewController extends Controller {
  @action
  afterSubmit({ slug }) {
    this.transitionToRoute("edit.questions.edit", slug);
  }
}
