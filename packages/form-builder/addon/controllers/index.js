import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class IndexController extends Controller {
  @service router;

  @action
  newForm() {
    this.router.transitionTo("new");
  }

  @action
  editForm({ slug }) {
    this.router.transitionTo("edit", slug);
  }
}
