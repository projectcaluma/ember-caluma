import Controller from "@ember/controller";
import { action } from "@ember/object";

export default class IndexController extends Controller {
  @action
  newForm() {
    this.transitionToRoute("new");
  }

  @action
  editForm({ slug }) {
    this.transitionToRoute("edit", slug);
  }
}
