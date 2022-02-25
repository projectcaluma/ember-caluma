import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";

export default class IndexController extends Controller {
  @service router;

  queryParams = ["search", "category"];

  @tracked search = "";
  @tracked category = "active";

  @action
  newForm() {
    this.router.transitionTo("new");
  }

  @action
  editForm({ slug }) {
    this.router.transitionTo("edit", slug);
  }
}
