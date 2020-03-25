import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    afterSubmit() {
      this.transitionToRoute("edit");
    },
  },
});
