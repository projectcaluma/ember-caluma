import { computed } from "@ember/object";
import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";

export default RenderComponent.extend({
  boolValue: computed.equal("value", "true"),

  actions: {
    toggle(boolValue) {
      this.update(String(boolValue));
    },
  },
});
