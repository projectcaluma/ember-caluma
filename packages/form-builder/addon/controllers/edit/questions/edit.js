import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class EditQuestionsEditController extends Controller {
  @action
  afterSubmit() {
    this.transitionToRoute("edit");
  }
}
