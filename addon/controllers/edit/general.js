import Controller from "@ember/controller";

export default Controller.extend({
  actions: {
    afterArchive() {
      this.transitionToRoute("index");
    }
  }
});
