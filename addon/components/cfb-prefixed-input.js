import Component from "@ember/component";
import { reads } from "@ember/object/computed";
import layout from "../templates/components/cfb-prefixed-input";

export default Component.extend({
  layout,
  tagName: "",

  prefix: reads("parentView.prefix"),
  errors: reads("parentView.errors"),
  dirty: reads("parentView.dirty"),

  actions: {
    update({ target: { value } }) {
      this.get("update")(value);
    },
    blur() {
      const setDirty = this.get("setDirty");

      if (setDirty) {
        setDirty();
      }
    }
  }
});
