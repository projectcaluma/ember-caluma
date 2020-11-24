import { computed } from "@ember/object";
import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";

import layout from "../templates/components/cfb-jexl-boolean-toggle-switch";

export default RenderComponent.extend({
  layout,

  boolValue: computed.equal("value", "true"),

  actions: {
    toggle(boolValue) {
      this.update(String(boolValue));
    },
  },
});
