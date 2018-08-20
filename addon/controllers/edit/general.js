import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    afterDelete() {
      this.transitionToRoute("index");
    }
  }
});
