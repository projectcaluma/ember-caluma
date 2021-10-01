import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";

export default class EditController extends Controller {
  @service router;

  @action
  createQuestion() {
    this.router.transitionTo("edit.questions.new");
  }

  @action
  editQuestion({ slug }) {
    this.router.transitionTo("edit.questions.edit", slug);
  }

  @action
  afterRemoveQuestion({ slug }) {
    if (
      /edit\.questions\.edit$/.test(this.router.currentRouteName) &&
      new RegExp(`/${slug}$`).test(this.router.currentURL)
    ) {
      this.router.transitionTo("edit.general");
    }
  }

  @action
  clickForm({ slug }) {
    this.router.transitionTo("edit", slug);
  }
}
