import Controller from "@ember/controller";
import { inject as service } from "@ember/service";

export default Controller.extend({
  router: service(),

  actions: {
    createQuestion() {
      this.transitionToRoute("edit.questions.new");
    },
    editQuestion({ slug }) {
      this.transitionToRoute("edit.questions.edit", slug);
    },
    afterRemoveQuestion({ slug }) {
      if (
        /edit\.questions\.edit$/.test(this.get("router.currentRouteName")) &&
        new RegExp(`/${slug}$`).test(this.get("router.currentURL"))
      ) {
        this.transitionToRoute("edit.general");
      }
    }
  }
});
