import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";
import layout from "../templates/components/cfb-jexl-boolean-toggle-switch";
import { computed } from "@ember/object";

export default RenderComponent.extend({
  layout,

  didReceiveAttrs() {
    this._super(...arguments);
  },

  boolValue: computed("value", function () {
    return this.get("value") === "true";
  }),

  actions: {
    toggle(boolValue) {
      this.get("update")(String(boolValue));
    },
  },
});
