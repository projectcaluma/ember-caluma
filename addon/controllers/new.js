import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    afterSubmit({ slug }) {
      this.transitionToRoute("edit", slug);
    },
    back() {
      this.transitionToRoute("index");
    }
  }
});
