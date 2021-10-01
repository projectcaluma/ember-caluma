import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class EditQuestionsEditController extends Controller {
  @service router;

  @action
  afterSubmit() {
    this.router.transitionTo("edit");
  }
}
