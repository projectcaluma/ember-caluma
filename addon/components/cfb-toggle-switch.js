import Component from "@ember/component";

export default Component.extend({
  actions: {
    toggle(value) {
      this.update(value);
    },
  },
});
