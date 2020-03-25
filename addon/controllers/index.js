import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    newForm() {
      this.transitionToRoute("new");
    },
    editForm({ slug }) {
      this.transitionToRoute("edit", slug);
    },
  },
});
