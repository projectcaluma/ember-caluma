import RenderComponent from "ember-validated-form/components/validated-input/-themes/uikit/render";
import layout from "../templates/components/cfb-jexl-boolean-toggle-switch";
import jexl from "jexl";
import { reads } from "@ember/object/computed";
import { task } from "ember-concurrency";
import { computed } from "@ember/object";

export default RenderComponent.extend({
  layout,

  didReceiveAttrs() {
    this._super(...arguments);

    this.get("_boolValue").perform();
  },

  boolValue: reads("_boolValue.lastSuccessful.value"),

  _boolValue: task(function*() {
    return yield jexl.eval(this.get("value"));
  }),

  disabled: computed("value", function() {
    const value = this.get("value");
    return !(value === "true" || value === "false");
  }),

  actions: {
    toggle(boolValue) {
      this.get("update")(String(boolValue));
    }
  }
});
