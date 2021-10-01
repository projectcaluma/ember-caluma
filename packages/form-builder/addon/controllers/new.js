import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class NewController extends Controller {
  @service router;

  @action
  afterSubmit({ slug }) {
    this.router.transitionTo("edit", slug);
  }
}
