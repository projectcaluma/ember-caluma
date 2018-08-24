import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    back() {
      this.transitionToRoute("index");
    },
    editQuestion({ slug }) {
      this.transitionToRoute("edit.question", slug);
    }
  }
});
