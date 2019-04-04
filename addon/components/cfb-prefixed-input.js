import Component from "@ember/component";
import layout from "../templates/components/cfb-prefixed-input";
import { computed } from "@ember/object";

export default Component.extend({
  layout,
  tagName: "",

  init() {
    this._super(...arguments);
    console.log(this);
  },

  dirty: computed("parentView.dirty", function() {
    return this.get("parentView.dirty");
  }),

  showError: computed("dirty", "isInvalid", function() {
    return this.isDirty && this.isInvalid;
  }),

  actions: {
    update({ target: { value } }) {
      this.get("update")(value);
      this.get("setDirty")();
      console.log(this);
    }
  }
});
