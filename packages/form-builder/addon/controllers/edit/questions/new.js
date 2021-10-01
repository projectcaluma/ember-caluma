import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class EditQuestionsNewController extends Controller {
  @service router;

  @action
  afterSubmit({ slug }) {
    this.router.transitionTo("edit.questions.edit", slug);
  }
}
