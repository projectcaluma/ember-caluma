import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    editForm({ slug }) {
      this.transitionToRoute("edit", slug);
    }
  }
});
